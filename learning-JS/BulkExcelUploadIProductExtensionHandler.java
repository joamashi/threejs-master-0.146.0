/*
 * #%L
 * BreezeCommerce by GSSHOP
 * %%
 * Copyright (C) 2015 - 2018 BREEZE Commerce
 * %%
 * Licensed under the GSSHOP BREEZE License, Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License under controlled by GSSHOP
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package kr.brzc.common.bulk.service.handler;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.StringUtils;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.broadleafcommerce.common.extension.ExtensionResultHolder;
import org.broadleafcommerce.common.extension.ExtensionResultStatusType;
import org.broadleafcommerce.common.file.service.BroadleafFileService;
import org.broadleafcommerce.common.media.domain.Media;
import org.broadleafcommerce.common.money.Money;
import org.broadleafcommerce.common.util.TransactionUtils;
import org.broadleafcommerce.core.catalog.domain.Category;
import org.broadleafcommerce.core.catalog.domain.CategoryProductXref;
import org.broadleafcommerce.core.catalog.domain.CategoryProductXrefImpl;
import org.broadleafcommerce.core.catalog.domain.CrossSaleProductImpl;
import org.broadleafcommerce.core.catalog.domain.Product;
import org.broadleafcommerce.core.catalog.domain.ProductAttribute;
import org.broadleafcommerce.core.catalog.domain.ProductAttributeImpl;
import org.broadleafcommerce.core.catalog.domain.ProductImpl;
import org.broadleafcommerce.core.catalog.domain.ProductOption;
import org.broadleafcommerce.core.catalog.domain.ProductOptionValue;
import org.broadleafcommerce.core.catalog.domain.ProductOptionXref;
import org.broadleafcommerce.core.catalog.domain.ProductOptionXrefImpl;
import org.broadleafcommerce.core.catalog.domain.RelatedProduct;
import org.broadleafcommerce.core.catalog.domain.Sku;
import org.broadleafcommerce.core.catalog.domain.SkuImpl;
import org.broadleafcommerce.core.catalog.domain.SkuMediaXref;
import org.broadleafcommerce.core.catalog.domain.SkuMediaXrefImpl;
import org.broadleafcommerce.core.catalog.domain.SkuProductOptionValueXref;
import org.broadleafcommerce.core.catalog.domain.SkuProductOptionValueXrefImpl;
import org.broadleafcommerce.core.catalog.domain.UpSaleProductImpl;
import org.broadleafcommerce.core.inventory.service.type.InventoryType;
import org.broadleafcommerce.core.order.service.type.FulfillmentType;

import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.services.directory.model.ServiceException;

import kr.brzc.admin.bulk.domain.BulkErrorType;
import kr.brzc.admin.bulk.domain.BulkFileType;
import kr.brzc.admin.bulk.domain.BulkProductHeader;
import kr.brzc.admin.bulk.domain.BulkUploadResultProperty;
import kr.brzc.admin.bulk.domain.BulkUploadStatusType;
import kr.brzc.admin.bulk.domain.BulkWorkBook;
import kr.brzc.admin.bulk.service.BulkService;
import kr.brzc.admin.bulk.service.extension.BulkUploadServiceAbstractExtensionHandler;

import kr.brzc.cms.customfield.domain.CustomField;
import kr.brzc.cms.customfield.domain.CustomFieldValue;
import kr.brzc.cms.customfield.domain.CustomFieldValueImpl;
import kr.brzc.cms.customfield.service.CustomFieldService;

import kr.brzc.common.dynamicattr.domain.DynamicAttr;
import kr.brzc.common.dynamicattr.service.DynamicAttrService;
import kr.brzc.common.media.service.MediaService;
import kr.brzc.common.util.DateUtils;

import kr.brzc.core.catalog.brand.domain.Brand;
import kr.brzc.core.catalog.domain.extension.ExtProduct;
import kr.brzc.core.catalog.info.domain.ProductInfo;
import kr.brzc.core.catalog.info.domain.ProductInfoContents;
import kr.brzc.core.catalog.info.domain.ProductInfoContentsImpl;
import kr.brzc.core.catalog.info.domain.ProductInfoField;
import kr.brzc.core.catalog.info.domain.ProductInfoProductXref;
import kr.brzc.core.catalog.info.service.ProductInfoService;
import kr.brzc.core.catalog.service.BrzCatalogService;

import kr.brzc.core.webhook.domain.WebhookPointType;
import kr.brzc.core.webhook.service.WebhookService;

/**
 * product 업로드
 * @author ejkim
 * 
 *
 */
@Service("brzBulkExcelUploadProductExtensionHandler") 
public class BulkExcelUploadIProductExtensionHandler extends BulkUploadServiceAbstractExtensionHandler {
	
	protected static final String FILE_TYPE = BulkFileType.EXCEL.getType();
	
	protected int priority = -100;

	@Resource(name = "blFileService")
  	BroadleafFileService fileService;
	
	@Resource(name="brzBulkService")
	BulkService brzBulkService;
	
	@Resource(name = "blCatalogService")
	protected BrzCatalogService catalogService;
	
  	@Resource(name = "brzDynamicAttrService")
	protected DynamicAttrService dynamicAttrService;

	@Resource(name="brzCustomFieldService")
	protected CustomFieldService customFieldService;
	
	@Resource(name="brzProductInfoService")
	protected ProductInfoService productInfoService;
	
	@Resource(name="brzBulkProductHeader")
	protected BulkProductHeader productHeader;
	
	@Resource(name="brzMediaService")
	protected MediaService brzMediaService;
	
	@Resource(name = "brzWebhookService")
	protected WebhookService webhookService;
	
	@Resource(name = "blTransactionManager")
	protected PlatformTransactionManager transactionManager;
	
	
  	protected static final String SECTION_KEY = "product";
    
	@PostConstruct
	public void init(){
		extensionManager.registerHandler(this);
	}
	
	@Override
	public Boolean canHandle(ExtensionResultHolder<Object> resultHolder){
		return resultHolder.getContextMap().get("fileType").equals(FILE_TYPE) && (resultHolder.getContextMap().get("sectionKey").equals(SECTION_KEY));
	}
	
	@SuppressWarnings("resource")
	@Override
	public ExtensionResultStatusType postFileUpload(ExtensionResultHolder<Object> resultHolder, BulkUploadResultProperty resultProp){
		if(canHandle(resultHolder)) {
			//excel Type일 경우에만 핸들러 실행
			String sectionKey = (String)resultHolder.getContextMap().get("sectionKey");
			InputStream targetFile = (InputStream)resultHolder.getContextMap().get("targetFile");
			
			resultProp.setStatus(BulkUploadStatusType.FILE_GENERATING.getType());
			
			WebhookPointType webhookType = null;
			List<Product> bulkProduct = new ArrayList<>();
			
			try {
				
				OPCPackage opcPackage = OPCPackage.open(targetFile);
				Workbook workbook = new XSSFWorkbook(opcPackage);
				
				String sheetName = sectionKey;
				
				//mainSheet
				if(workbook.getSheet(sheetName) == null){
					brzBulkService.setErrorMessage(resultProp, BulkFileType.EXCEL.getType(), BulkErrorType.ERROR_1100.getFriendlyType(), null, true);
					return ExtensionResultStatusType.HANDLED;
				}
				
				int bodyIndex = 3;
			
				//mainSheet생성
				BulkWorkBook mainWorkBook = new BulkWorkBook(workbook, sheetName, bodyIndex);
				
				//attributeField
			 	List<DynamicAttr> dynamicAttrs = dynamicAttrService.getDynamicAttrs(ProductImpl.class.getName());
				//customField
				List<CustomField> customFields = customFieldService.getCustomFieldList(Product.class.getName());
				
				//mainSheet 전체 건수
				resultProp.setTotalCount(mainWorkBook.size());
				resultProp.setCurrentRow(2);
				
				for(Map<String, String> row : mainWorkBook.body()) {
					
					//addMode
					String addMode = "";
					String mainMappingKey = "";
					
					if(row.containsKey("ID")){
						addMode = "UPDATE";
						mainMappingKey = row.get("ID");
					}else if(row.containsKey("TEMP_ID")){
						addMode = "ADD";
						mainMappingKey = row.get("TEMP_ID");
					}
					
					if(StringUtils.isBlank(mainMappingKey) || StringUtils.isBlank(addMode)){
						brzBulkService.setErrorMessage(resultProp, BulkFileType.EXCEL.getType(), BulkErrorType.ERROR_1500.getFriendlyType(), null, true);
						break;
					}
					
					//webhookType
					if(webhookType == null){
						if(addMode.equals("ADD")){
							webhookType = WebhookPointType.CREATE;
						}else{
							webhookType = WebhookPointType.UPDATE;
						}
					}
					
					resultProp.setCurrentRow(resultProp.getCurrentRow()+1);
					
					try{
						Product product = null;
						
						if(addMode.equals("ADD")){
							//신규 등록
							product = new ProductImpl();
							product.setDefaultSku(new SkuImpl());
						}else {
							//수정
							product = catalogService.findProductById(Long.parseLong(mainMappingKey));
							
							if(product == null){
								//상품정보 없음
								brzBulkService.setErrorMessage(resultProp, BulkFileType.EXCEL.getType(), "상품정보가 없음", null, false, "product", resultProp.getCurrentRow());
								resultProp.setFailCount(resultProp.getFailCount()+1);
								continue;
							}
						}
						
						//product 기본 정보 셋팅
						product = generateProduct(row, product, resultProp, dynamicAttrs, customFields);
						if(product == null) continue;
						
						//productInfo
						generateProductInfo(resultProp, workbook, product, mainMappingKey, addMode);
						//productOption
						generateProductOption(resultProp, workbook, product, mainMappingKey, addMode);
						//productSku
						generateProductSkus(resultProp, workbook, product, mainMappingKey, addMode);
						//crossProduct
						generateCrossProduct(resultProp, workbook, product, mainMappingKey, addMode);
						//upProdcut
						generateUpProduct(resultProp, workbook, product, mainMappingKey, addMode);
						//attrProduct
						generateProductAttrs(resultProp, workbook, product, mainMappingKey, addMode);
						
						bulkProduct.add(product);
					}catch (Exception e) {
						//등록 시 에러
						brzBulkService.setErrorMessage(resultProp, BulkFileType.EXCEL.getType(), e.getMessage(), null, false, "product", resultProp.getCurrentRow());
						resultProp.setFailCount(resultProp.getFailCount()+1);
					}
					
				}
				
			} catch(Exception e1) {
				e1.printStackTrace();
				brzBulkService.setErrorMessage(resultProp, BulkFileType.EXCEL.getType(), BulkErrorType.ERROR_1200.getFriendlyType(), e1, false);
			}
			
			webhookService.sendWebhook(ProductImpl.class.getName(), webhookType, null, bulkProduct);
			return ExtensionResultStatusType.HANDLED;
		}
		return ExtensionResultStatusType.NOT_HANDLED;
	}
	
	protected Product generateProduct(Map<String, String> row, Product product, BulkUploadResultProperty resultProp, List<DynamicAttr> dynamicAttrs, List<CustomField> customFields){
		
		TransactionStatus status = TransactionUtils.createTransaction("Product Create",
                TransactionDefinition.PROPAGATION_REQUIRED, transactionManager, false);
		try{
			//상품명
			if(row.containsKey("defaultSku.name") && StringUtils.isNotBlank(row.get("defaultSku.name"))) product.setName(row.get("defaultSku.name"));
			//짧은 설명
			if(row.containsKey("defaultSku.description") && StringUtils.isNotBlank(row.get("defaultSku.description"))) product.getDefaultSku().setDescription(row.get("defaultSku.description"));
			//기본이미지
			if(row.containsKey("defaultSku.skuMedia---primary") && StringUtils.isNotBlank(row.get("defaultSku.skuMedia---primary"))){
				String mediaId = row.get("defaultSku.skuMedia---primary");
				
				Media media = brzMediaService.findMediaById(Long.parseLong(mediaId));
			
				if(media != null){
					Map<String, SkuMediaXref> mediaXref = product.getDefaultSku().getSkuMediaXref();
					if(mediaXref.containsKey("primary")){
						SkuMediaXref xref = mediaXref.get("primary");
						xref.setMedia(media);
						mediaXref.put("primary", xref);
						product.getDefaultSku().getSkuMediaXref().put("primary", xref);
					}else{
						SkuMediaXref xref = new SkuMediaXrefImpl();
						xref.setMedia(media);
						xref.setSku(product.getDefaultSku());
						xref.setKey("primary");
						mediaXref.put("primary", xref);
						product.getDefaultSku().getSkuMediaXref().put("primary", xref);
					}
					
				}
			}
			//마우스오버이미지
			if(row.containsKey("defaultSku.skuMedia---hover") && StringUtils.isNotBlank(row.get("defaultSku.skuMedia---hover"))){
				String mediaId = row.get("defaultSku.skuMedia---hover");
				
				Media media = brzMediaService.findMediaById(Long.parseLong(mediaId));
			
				if(media != null){
					Map<String, SkuMediaXref> mediaXref = product.getDefaultSku().getSkuMediaXref();
					if(mediaXref.containsKey("hover")){
						SkuMediaXref xref = mediaXref.get("hover");
						xref.setMedia(media);
						mediaXref.put("hover", xref);
						product.getDefaultSku().getSkuMediaXref().put("hover", xref);
					}else{
						SkuMediaXref xref = new SkuMediaXrefImpl();
						xref.setMedia(media);
						xref.setSku(product.getDefaultSku());
						xref.setKey("hover");
						mediaXref.put("hover", xref);
						product.getDefaultSku().getSkuMediaXref().put("hover", xref);
					}
				}
			}
			//이미지 오버레이
			if(row.containsKey("overlayText") && StringUtils.isNotBlank(row.get("overlayText"))) ((ExtProduct)product).setOverlayText(row.get("overlayText"));
			//상세설명
			if(row.containsKey("defaultSku.longDescription") && StringUtils.isNotBlank(row.get("defaultSku.longDescription"))) product.getDefaultSku().setLongDescription(row.get("defaultSku.longDescription"));
			//상위카테고리
			if(row.containsKey("defaultCategory") && StringUtils.isNotBlank(row.get("defaultCategory"))){
				String parentCategory = row.get("defaultCategory");
				
				Category category = catalogService.findCategoryById(Long.parseLong(parentCategory));
			
				if(category != null){
					List<CategoryProductXref> defaultCategoryList = product.getAllParentCategoryXrefs();
					boolean isDefault = false;
					for(CategoryProductXref defaultCategory : defaultCategoryList){
						if(defaultCategory.getDefaultReference()!=null && defaultCategory.getDefaultReference()){
							defaultCategory.setCategory(category);
							isDefault = true;
						}
					}
					
					if(!isDefault){
						CategoryProductXref xref = new CategoryProductXrefImpl();
						xref.setDefaultReference(true);
						xref.setCategory(category);
						xref.setProduct(product);
						product.getAllParentCategoryXrefs().add(xref);
					}
				}
			}
			//생산자
			if(row.containsKey("manufacturer") && StringUtils.isNotBlank(row.get("manufacturer"))) product.setManufacturer(row.get("manufacturer"));

			//Url
			if(row.containsKey("url") && StringUtils.isNotBlank(row.get("url"))) product.setUrl(row.get("url"));
			
			//정상가
			if(row.containsKey("defaultSku.retailPrice") && StringUtils.isNotBlank(row.get("defaultSku.retailPrice"))) product.getDefaultSku().setRetailPrice(new Money(row.get("defaultSku.retailPrice")));
			
			//할인가
			if(row.containsKey("defaultSku.salePrice") && StringUtils.isNotBlank(row.get("defaultSku.salePrice"))) product.getDefaultSku().setSalePrice(new Money(row.get("defaultSku.salePrice")));
			
			//판매시작일
			if(row.containsKey("defaultSku.activeStartDate") && StringUtils.isNotBlank(row.get("defaultSku.activeStartDate")))  product.getDefaultSku().setActiveStartDate(DateUtils.parseDate(row.get("defaultSku.activeStartDate"), "yyyy-MM-dd HH:mm:ss"));
			
			//판매종료일
			if(row.containsKey("defaultSku.activeEndDate") && StringUtils.isNotBlank(row.get("defaultSku.activeEndDate"))) product.getDefaultSku().setActiveEndDate(DateUtils.parseDate(row.get("defaultSku.activeEndDate"), "yyyy-MM-dd HH:mm:ss"));
			
			//재고확인방식
			if(row.containsKey("defaultSku.inventoryType") && StringUtils.isNotBlank(row.get("defaultSku.inventoryType"))){
				InventoryType inventoryType = InventoryType.getInstance(row.get("defaultSku.inventoryType"));
				if(inventoryType != null){
					product.getDefaultSku().setInventoryType(inventoryType);
				}
			}
			
			//기본배송방식
			if(row.containsKey("defaultSku.fulfillmentType") && StringUtils.isNotBlank(row.get("defaultSku.fulfillmentType"))){
				FulfillmentType fulfillmentType = FulfillmentType.getInstance(row.get("defaultSku.fulfillmentType"));
				if(fulfillmentType != null){
					product.getDefaultSku().setFulfillmentType(fulfillmentType);
				}
			}
			
			//브랜드
			if(row.containsKey("brand") && StringUtils.isNotBlank(row.get("brand"))){
				//브랜드 코드로 브랜드 조회
				String brandId = row.get("brand");
				Brand brand = catalogService.findBrandById(Long.parseLong(brandId));
				
				if(brand != null){
					((ExtProduct)product).setBrand(brand);
				}
			}
			
			//할인적용여부
			if(row.containsKey("defaultSku.discountable") && StringUtils.isNotBlank(row.get("defaultSku.discountable"))) product.getDefaultSku().setDiscountable(row.get("defaultSku.discountable").toLowerCase().equals("true") ? Boolean.TRUE : Boolean.FALSE);
			
			//upc
			if(row.containsKey("defaultSku.upc") && StringUtils.isNotBlank(row.get("defaultSku.upc"))) product.getDefaultSku().setUpc(row.get("defaultSku.upc"));
			
			//옵션선택없이구매가능여부
			if(row.containsKey("canSellWithoutOptions") && StringUtils.isNotBlank(row.get("canSellWithoutOptions"))) product.setCanSellWithoutOptions(row.get("canSellWithoutOptions").toLowerCase().equals("true") ? Boolean.TRUE : Boolean.FALSE);
			
			//구매제한수량
			if(row.containsKey("maxQuantity") && StringUtils.isNotBlank(row.get("maxQuantity"))){
				String maxQuantity = row.get("maxQuantity");
				((ExtProduct)product).setMaxQuantity(Integer.parseInt(maxQuantity));
			} 
			
			//회원별구매제한수량
			if(row.containsKey("maxQuantityPerCustomer") && StringUtils.isNotBlank(row.get("maxQuantityPerCustomer"))){
				String maxQuantityPerCustomer = row.get("maxQuantityPerCustomer");
				((ExtProduct)product).setMaxQuantityPerCustomer(Integer.parseInt(maxQuantityPerCustomer));
			}
			
			//model
			if(row.containsKey("model") && StringUtils.isNotBlank(row.get("model"))) product.setModel(row.get("model"));
			
			//로그인한 회원만 구매 가능여부
			if(row.containsKey("registeredUserOnly") && StringUtils.isNotBlank(row.get("registeredUserOnly"))) ((ExtProduct)product).setRegisteredUserOnly(row.get("registeredUserOnly").toLowerCase().equals("true") ? Boolean.TRUE : Boolean.FALSE);
			
			//전시가능여부
			if(row.containsKey("usable") && StringUtils.isNotBlank(row.get("usable"))) ((ExtProduct)product).setUsable(row.get("usable").toLowerCase().equals("true") ? Boolean.TRUE : Boolean.FALSE);
			
			//외부연동 ExternalId
			if(row.containsKey("defaultSku.externalId") && StringUtils.isNotBlank(row.get("defaultSku.externalId"))) product.getDefaultSku().setExternalId(row.get("defaultSku.externalId"));
			
			//번들상품은 bulk등록안하기 때문에 번들여부는 skip
			
			//추천상품뱃지여부
			if(row.containsKey("isFeaturedProduct") && StringUtils.isNotBlank(row.get("isFeaturedProduct"))) product.setFeaturedProduct(row.get("isFeaturedProduct").toLowerCase().equals("true") ? Boolean.TRUE : Boolean.FALSE);
			
			//new뱃지여부
			if(row.containsKey("isNewProduct") && StringUtils.isNotBlank(row.get("isNewProduct"))) ((ExtProduct)product).setIsNewProduct(row.get("isNewProduct").toLowerCase().equals("true") ? Boolean.TRUE : Boolean.FALSE);
			
			//hot뱃지여부
			if(row.containsKey("isHotProduct") && StringUtils.isNotBlank(row.get("isHotProduct"))) ((ExtProduct)product).setIsHotProduct(row.get("isHotProduct").toLowerCase().equals("true") ? Boolean.TRUE : Boolean.FALSE);

			//설정된 dynamicAttrs가 있다면 체크해서 셋팅
			if(CollectionUtils.isNotEmpty(dynamicAttrs)){
				for(DynamicAttr dynamicAttr : dynamicAttrs){
					
					if(row.containsKey(dynamicAttr.getName()) && StringUtils.isNotBlank(row.get(dynamicAttr.getName()))){
						String attrValue = row.get(dynamicAttr.getName());
						//product에 셋팅된 값이 없다면 신규 등록 있다면 수정
						if(MapUtils.isNotEmpty(product.getProductAttributes()) && product.getProductAttributes().containsKey(dynamicAttr.getName())){
							ProductAttribute attribute = product.getProductAttributes().get(dynamicAttr.getName());
							attribute.setValue(attrValue);
						}else{
							ProductAttribute attribute = new ProductAttributeImpl();
							attribute.setName(dynamicAttr.getName());
							attribute.setProduct(product);
							attribute.setSearchable(dynamicAttr.getIsSearchFacet());
							attribute.setValue(attrValue);
							product.getProductAttributes().put(dynamicAttr.getName(), attribute);
						}
					}
				}
			}
			
			product = catalogService.saveProduct(product);
			
			//상품정보고시
			if(row.containsKey("productInfo") && StringUtils.isNotBlank(row.get("productInfo"))){
				String prodcutInfo = row.get("productInfo");
				
				ProductInfo newProductInfo = productInfoService.findProductInfoById(Long.parseLong(prodcutInfo));
				
				//기존 연결된 정보고시가 있고 동일 하다면 skip, 아니면 기존 정보고시 삭제후 등록
				ProductInfoProductXref productInfoXref = productInfoService.findProductInfoProductXrefByProductId(product.getId());
				if(newProductInfo!= null && productInfoXref != null && !productInfoXref.getProductInfo().getId().equals(newProductInfo.getId())){
					productInfoService.removeProductInfo(product.getId());
					ProductInfoProductXref newproductInfoXref = productInfoService.saveProductInfoProductXref(newProductInfo.getId(), product.getId());
					
					if(newproductInfoXref != null && CollectionUtils.isNotEmpty(newproductInfoXref.getProductInfo().getFieldDefinitions())){
						List<ProductInfoField> infoFields = newproductInfoXref.getProductInfo().getFieldDefinitions();
						for(ProductInfoField infoField : infoFields){
							productInfoService.saveProductInfoContents(product.getId(), infoField.getName(), ""); 
						}
					}
					
				}else if(newProductInfo != null && productInfoXref == null){
					ProductInfoProductXref newproductInfoXref = productInfoService.saveProductInfoProductXref(newProductInfo.getId(), product.getId());
					
					if(newproductInfoXref != null && CollectionUtils.isNotEmpty(newproductInfoXref.getProductInfo().getFieldDefinitions())){
						List<ProductInfoField> infoFields = newproductInfoXref.getProductInfo().getFieldDefinitions();
						for(ProductInfoField infoField : infoFields){
							productInfoService.saveProductInfoContents(product.getId(), infoField.getName(), ""); 
						}
					}
				}
			}
			
			//설정된 customFields가 있다면 체크해서 셋팅
			if(CollectionUtils.isNotEmpty(customFields)){
				Map<String, CustomFieldValue> customFieldMap = customFieldService.getCustomFieldValue(Product.class.getName(), product.getId().toString());
				for(CustomField customField : customFields){
					if(row.containsKey(customField.getName()) && StringUtils.isNotBlank(row.get(customField.getName()))){
						String customValue = row.get(customField.getName());
						CustomFieldValue value = null;
						if(customFieldMap.containsKey(customField.getName())){
							value = customFieldMap.get(customField.getName());
							value.setValue(customValue);
						}else{
							value = new CustomFieldValueImpl();
							value.setCustomField(customField);
							value.setCustomFieldTarget(customField.getTargetEntity());
							value.setFieldKey(product.getId().toString());
							value.setValue(customValue);
						}
						customFieldService.saveCustomFieldValue(value);
					}
				}
			}
			
			TransactionUtils.finalizeTransaction(status, transactionManager, false);
		}catch (Exception e) {
			//등록 시 에러
			if (!status.isCompleted()) {
                TransactionUtils.finalizeTransaction(status, transactionManager, true);
            };
			brzBulkService.setErrorMessage(resultProp, BulkFileType.EXCEL.getType(), e.toString(), null, false, "product", resultProp.getCurrentRow());
			resultProp.setFailCount(resultProp.getFailCount()+1);
			return null;
		}
		
		resultProp.setSuccessCount(resultProp.getSuccessCount()+1);
		return product;
	}
	
	@Transactional("blTransactionManager")
	protected Product generateProductInfo(BulkUploadResultProperty resultProp, Workbook workbook, Product product, String mappingKey, String addMode){
		int bodyIndex = 3;
		int currentRow = 3;
		BulkWorkBook productInfoWorkBook = new BulkWorkBook(workbook, "productInfo", bodyIndex);
		List<ProductInfoField> productInfoFields = productInfoService.getProductInfoFieldByProductId(product.getId());
		
		if(productInfoFields == null) return null;
		
		for(Map<String, String> row : productInfoWorkBook.body()){
			try{
				String productId = "";
				if(addMode.equals("ADD")) productId = row.get("TEMP_ID");
				else productId = row.get("ID");
				
				if(mappingKey.equals(productId)){
					String infoField = row.get("field");
					String infoValue = row.get("value");
					
					for(ProductInfoField productInfoField : productInfoFields){
						if(productInfoField.getFriendlyName().equals(infoField)){
							ProductInfoContents contents = productInfoService.findProductInfoContents(product.getId(), productInfoField.getName());
							if(contents == null){
								contents = new ProductInfoContentsImpl();
								contents.setFieldKey(productInfoField.getName());
								contents.setProductId(product.getId());
								contents.setValue(infoValue);
								
								
							}else{
								if(StringUtils.isNotBlank(infoValue)){
									contents.setValue(infoValue);
								} 
							}
							productInfoService.saveProductInfoContents(contents);
							break;
						}
					}
				}
				
			}catch (Exception e) {
				brzBulkService.setErrorMessage(resultProp, BulkFileType.EXCEL.getType(), e.toString(), null, false, "productInfo", currentRow);
			}
			
			currentRow++;
		}
		
		return product;
	}
	
	protected Product generateProductOption(BulkUploadResultProperty resultProp, Workbook workbook, Product product, String mappingKey, String addMode){
		int bodyIndex = 3;
		int currentRow = 3;
		BulkWorkBook productOptionsWorkBook = new BulkWorkBook(workbook, "productOptions", bodyIndex);
		
		for(Map<String, String> row : productOptionsWorkBook.body()){
			try{
				String productId = "";
				if(addMode.equals("ADD")) productId = row.get("TEMP_ID");
				else productId = row.get("ID");
				
				if(mappingKey.equals(productId)){
					String optionId = row.get("productOptions.id");
					if(optionId.indexOf(".") > -1){
						optionId = optionId.substring(0, optionId.indexOf("."));
					}
					
					ProductOption option = catalogService.findProductOptionById(Long.parseLong(optionId));
					
					if(option != null){
						
						List<ProductOptionXref> xrefs =  product.getProductOptionXrefs();
						Boolean isHasOption = false;
						for(ProductOptionXref xref : xrefs){
							if(option.getId().equals(xref.getProductOption().getId())){
								isHasOption = true;
								break;
							}
						}
						
						if(!isHasOption){
							ProductOptionXref newOption = new ProductOptionXrefImpl();
							newOption.setProduct(product);
							newOption.setProductOption(option);
							xrefs.add(newOption);
							product.setProductOptionXrefs(xrefs);
							catalogService.saveProduct(product);
						}
						
					}
				}
				
			}catch (Exception e) {
				brzBulkService.setErrorMessage(resultProp, BulkFileType.EXCEL.getType(), e.toString(), null, false, "productOptions", currentRow);
			}
			
			currentRow++;
		}
		
		return product;
	}
	
	protected Product generateProductSkus(BulkUploadResultProperty resultProp, Workbook workbook, Product product, String mappingKey, String addMode){
		
		//등록 된 option이 없는 경우는 sku에 대한 처리 없음.
		List<ProductOptionXref> productOptionXrefs = product.getProductOptionXrefs();
		
		if(CollectionUtils.isNotEmpty(productOptionXrefs)){
			int bodyIndex = 3;
			int currentRow = 3;
			BulkWorkBook productSkuWorkBook = new BulkWorkBook(workbook, "productSkus", bodyIndex);
			
			for(Map<String, String> row : productSkuWorkBook.body()){
				
				try{
					String productId = "";
					if(addMode.equals("ADD")) productId = row.get("TEMP_ID");
					else productId = row.get("ID");
					
					if(mappingKey.equals(productId)){
						String skuId = row.containsKey("skus.id") ? row.get("skus.id") : null;
						
						Sku sku = null;
						if(StringUtils.isNotBlank(skuId)){
							sku = catalogService.findSkuById(Long.parseLong(skuId));
							
							if(!productId.equals(sku.getProduct().getId().toString())){
								throw new ServiceException("productSkus");
							}
						}else{
							sku = new SkuImpl();
							sku.setProduct(product);
						}
						
						if(sku != null){
							//sku 기본정보 셋팅
							String name = row.containsKey("skus.name") ? row.get("skus.name") : "";
							String retailPrice = row.containsKey("skus.retailPrice") ? row.get("skus.retailPrice") : "";
							String salePrice = row.containsKey("skus.salePrice") ? row.get("skus.salePrice") : "";
							String activeStartDate = row.containsKey("skus.activeStartDate") ? row.get("skus.activeStartDate") : "";
							String activeEndDate = row.containsKey("skus.activeEndDate") ? row.get("skus.activeEndDate") : "";
							String inventoryType = row.containsKey("skus.inventoryType") ? row.get("skus.inventoryType") : "";
							String fulfillmentType = row.containsKey("skus.fulfillmentType") ? row.get("skus.fulfillmentType") : "";
							String discountable = row.containsKey("skus.discountable") ? row.get("skus.discountable") : "";
							String upc = row.containsKey("skus.upc") ? row.get("skus.upc") : "";
							String externalId = row.containsKey("skus.externalId") ? row.get("skus.externalId") : "";
							
							if(StringUtils.isNotBlank(name)) sku.setName(name);
							if(StringUtils.isNotBlank(retailPrice)) sku.setRetailPrice(new Money(retailPrice));
							if(StringUtils.isNotBlank(salePrice)) sku.setSalePrice(new Money(salePrice));
							if(StringUtils.isNotBlank(activeStartDate)) sku.setActiveStartDate(DateUtils.parseDate(activeStartDate, "yyyy-MM-dd HH:mm:ss"));
							if(StringUtils.isNotBlank(activeEndDate)) sku.setActiveEndDate(DateUtils.parseDate(activeEndDate, "yyyy-MM-dd HH:mm:ss"));
							if(StringUtils.isNotBlank(inventoryType)){
								InventoryType type = InventoryType.getInstance(inventoryType);
								if(type != null) sku.setInventoryType(type);
							} 
							if(StringUtils.isNotBlank(fulfillmentType)){
								FulfillmentType type = FulfillmentType.getInstance(fulfillmentType);
								if(type != null) sku.setFulfillmentType(type);
							} 
							if(StringUtils.isNotBlank(discountable)){
								sku.setDiscountable((discountable.toLowerCase().equals("true")||discountable.toUpperCase().equals("Y")) ? Boolean.TRUE : Boolean.FALSE);
							}
							if(StringUtils.isNotBlank(upc)){
								sku.setUpc(upc);
							}
							if(StringUtils.isNotBlank(externalId)){
								sku.setExternalId(externalId);
							}
							
							sku = catalogService.saveSku(sku);
							Set<SkuProductOptionValueXref> productOptionValueXrefs = sku.getProductOptionValueXrefs();
							
							for(ProductOptionXref productOptionXref : productOptionXrefs){
								
								String optionField = productOptionXref.getProductOption().getAttributeName();
								List<ProductOptionValue> productOptionValues = productOptionXref.getProductOption().getAllowedValues();
								
								//option에 등록된 allowedValue가 없으면 skip
								if(CollectionUtils.isEmpty(productOptionValues)) continue;
									
								if(row.containsKey(optionField) && StringUtils.isNotBlank(row.get(optionField))){
									String optionValueId = row.get(optionField);
									
									//sku 옵션 정보 셋팅
								    Boolean isHasOptionValue = false;
								    
									for(SkuProductOptionValueXref productOptionValueXref : productOptionValueXrefs){
										if(productOptionXref.getProductOption().getId().equals(productOptionValueXref.getProductOptionValue().getProductOption().getId())){
											isHasOptionValue = true;
											
											for(ProductOptionValue productOptionValue : productOptionValues){
												if(optionValueId.equals(productOptionValue.getId().toString())){
													productOptionValueXref.setProductOptionValue(productOptionValue);
													break;
												}
											}
											
											break;
										}
										
									}
									
									if(!isHasOptionValue){
										ProductOptionValue optionValue = null;
										
										for(ProductOptionValue productOptionValue : productOptionValues){
											if(optionValueId.equals(productOptionValue.getId().toString())){
												optionValue = productOptionValue;
												break;
											}
										}
										
										if(optionValue != null){
											SkuProductOptionValueXref optionValueXref = new SkuProductOptionValueXrefImpl();
											optionValueXref.setSku(sku);
											optionValueXref.setProductOptionValue(optionValue);
											sku.getProductOptionValueXrefs().add(optionValueXref);
										}
									}
									
								}
							}
							
							catalogService.saveSku(sku);
						}
						
					}
				}catch (Exception e) {
					brzBulkService.setErrorMessage(resultProp, BulkFileType.EXCEL.getType(), e.toString(), null, false, "productSkus", currentRow);
				}
				
				currentRow++;
			}
		}
		
		return product;
	}
	
	protected Product generateCrossProduct(BulkUploadResultProperty resultProp, Workbook workbook, Product product, String mappingKey, String addMode){
		int bodyIndex = 3;
		int currentRow = 3;
		BulkWorkBook productCrossWorkBook = new BulkWorkBook(workbook, "crossProduct", bodyIndex);
		
		for(Map<String, String> row : productCrossWorkBook.body()){
			try{
				String productId = "";
				if(addMode.equals("ADD")) productId = row.get("TEMP_ID");
				else productId = row.get("ID");
				
				if(mappingKey.equals(productId)){
					String crossProductId = row.get("crossProduct.id");
					
					Product crossProduct = catalogService.findProductById(Long.parseLong(crossProductId));
					
					if(crossProduct != null){
						
						String sequence = row.containsKey("crossProduct.seq") ? row.get("crossProduct.seq") : "";
						String promotionMessage = row.containsKey("crossProduct.promotionMessage") ? row.get("crossProduct.promotionMessage") : "";
						
						List<RelatedProduct> relatedProducts =  product.getCrossSaleProducts();
						Boolean isHasOption = false;
						for(RelatedProduct relatedProduct : relatedProducts){
							if(crossProductId.equals(relatedProduct.getRelatedProduct().getId().toString())){
								
								if(StringUtils.isNotBlank(sequence)){
									relatedProduct.setSequence(BigDecimal.valueOf(Long.parseLong(sequence)));
								}
								if(StringUtils.isNotBlank(promotionMessage)){
									relatedProduct.setPromotionMessage(promotionMessage);
								}
								
								catalogService.saveProduct(product);
								isHasOption = true;
								break;
							}
						}
						
						if(!isHasOption){
							RelatedProduct newCrossProduct = new CrossSaleProductImpl();
							newCrossProduct.setProduct(product);
							newCrossProduct.setRelatedProduct(crossProduct);
							if(StringUtils.isNotBlank(sequence)){
								newCrossProduct.setSequence(BigDecimal.valueOf(Long.parseLong(sequence)));
							}
							if(StringUtils.isNotBlank(promotionMessage)){
								newCrossProduct.setPromotionMessage(promotionMessage);
							}
							product.getCrossSaleProducts().add(newCrossProduct);
							catalogService.saveProduct(product);
						}
					}
				}
				
			}catch (Exception e) {
				brzBulkService.setErrorMessage(resultProp, BulkFileType.EXCEL.getType(), e.toString(), null, false, "crossProduct", currentRow);
			}
			
			currentRow++;
		}
		
		return product;
	}
	
	protected Product generateUpProduct(BulkUploadResultProperty resultProp, Workbook workbook, Product product, String mappingKey, String addMode){ 
		int bodyIndex = 3;
		int currentRow = 3;
		BulkWorkBook productUpWorkBook = new BulkWorkBook(workbook, "upProduct", bodyIndex);
		
		for(Map<String, String> row : productUpWorkBook.body()){
			try{
				String productId = "";
				if(addMode.equals("ADD")) productId = row.get("TEMP_ID");
				else productId = row.get("ID");
				
				if(mappingKey.equals(productId)){
					String upProductId = row.get("upProduct.id");
					Product upProduct = catalogService.findProductById(Long.parseLong(upProductId));
					
					if(upProduct != null){
						
						String sequence = row.containsKey("upProduct.seq") ? row.get("upProduct.seq") : "";
						String promotionMessage = row.containsKey("upProduct.promotionMessage") ? row.get("upProduct.promotionMessage") : "";
						
						List<RelatedProduct> relatedProducts =  product.getUpSaleProducts();
						Boolean isHasOption = false;
						for(RelatedProduct relatedProduct : relatedProducts){
							if(upProductId.equals(relatedProduct.getRelatedProduct().getId().toString())){
								
								if(StringUtils.isNotBlank(sequence)){
									relatedProduct.setSequence(BigDecimal.valueOf(Long.parseLong(sequence)));
								}
								if(StringUtils.isNotBlank(promotionMessage)){
									relatedProduct.setPromotionMessage(promotionMessage);
								}
								
								catalogService.saveProduct(product);
								isHasOption = true;
								break;
							}
						}
						
						if(!isHasOption){
							RelatedProduct newUpProduct = new UpSaleProductImpl();
							newUpProduct.setProduct(product);
							newUpProduct.setRelatedProduct(upProduct);
							if(StringUtils.isNotBlank(sequence)){
								newUpProduct.setSequence(BigDecimal.valueOf(Long.parseLong(sequence)));
							}
							if(StringUtils.isNotBlank(promotionMessage)){
								newUpProduct.setPromotionMessage(promotionMessage);
							}
							product.getUpSaleProducts().add(newUpProduct);
							catalogService.saveProduct(product);
						}
					}
				}
				
			}catch (Exception e) {
				brzBulkService.setErrorMessage(resultProp, BulkFileType.EXCEL.getType(), e.toString(), null, false, "upProduct", currentRow);
			}
			
			currentRow++;
		}
		
		return product;
	}
	
	protected Product generateProductAttrs(BulkUploadResultProperty resultProp, Workbook workbook, Product product, String mappingKey, String addMode){
		
		Map<String, ProductAttribute> productAttrs = product.getProductAttributes();
		
		int bodyIndex = 3;
		int currentRow = 3;
		BulkWorkBook productAttrWorkBook = new BulkWorkBook(workbook, "attrProduct", bodyIndex);
		
		for(Map<String, String> row : productAttrWorkBook.body()){
			TransactionStatus status = TransactionUtils.createTransaction("ProductAttr Create",
	                TransactionDefinition.PROPAGATION_REQUIRED, transactionManager, false);
			try{
				String productId = "";
				if(addMode.equals("ADD")) productId = row.get("TEMP_ID");
				else productId = row.get("ID");
				
				if(mappingKey.equals(productId)){
					String attrId = row.containsKey("attr.id") ? row.get("attr.id") : null;
					
					ProductAttribute attribute = null;
					if(StringUtils.isNotBlank(attrId)){
						attribute = catalogService.getProductAttributeById(Long.parseLong(attrId));
						
						if(!productId.equals(attribute.getProduct().getId().toString()) || !productAttrs.containsKey(attribute.getName())){
							throw new ServiceException("productAttribute");
						}
					}else{
						attribute = new ProductAttributeImpl();
						attribute.setProduct(product);
					}
					
					if(attribute != null){
						//attribute 기본정보 셋팅
						String name = row.containsKey("attr.key") ? row.get("attr.key") : "";
						String value = row.containsKey("attr.value") ? row.get("attr.value") : "";
						
						if(productAttrs.containsKey(attribute.getName())) productAttrs.remove(name);
						if(StringUtils.isNotBlank(name)) attribute.setName(name);
						if(StringUtils.isNotBlank(value)) attribute.setValue(value);
						productAttrs.put(name, attribute);
						catalogService.saveProduct(product);
					}
					
				}
				
				TransactionUtils.finalizeTransaction(status, transactionManager, false);
			}catch (Exception e) {
				//등록 시 에러
				if (!status.isCompleted()) {
	                TransactionUtils.finalizeTransaction(status, transactionManager, true);
	            };
				brzBulkService.setErrorMessage(resultProp, BulkFileType.EXCEL.getType(), e.toString(), null, false, "productAttrs", currentRow);
			}
			
			currentRow++;
		}
		
		return product;
	}
}
