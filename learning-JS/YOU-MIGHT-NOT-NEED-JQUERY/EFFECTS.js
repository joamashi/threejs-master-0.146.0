/**
 * Fade In
 * =================================================================================
 */

$(el).fadeIn();

el.classList.add('show');
el.classList.remove('hide');

/*
  .show { transition: opacity 400ms;}
  .hide { opacity: 0;}
*/

/**
 * Fade Out
 * =================================================================================
 */

$(el).fadeOut();

el.classList.add('hide');
el.classList.remove('show');

/*
  .show { opacity: 1;}
  .hide { opacity: 0; transition: opacity 400ms;}
*/

/**
 * Hide
 * =================================================================================
 */

$(el).hide();

el.style.display = 'none';
 
/**
 * Show
 * =================================================================================
 */

$(el).show();

el.style.display = '';
