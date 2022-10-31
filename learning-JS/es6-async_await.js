asyncFoo = async bar => {
  await (() => new Promise((resolve, reject) => {
    FooReducer.postBar(bar).then(resolve, reject2 => {
      const { message } = reject2.response.data.meta;
      toast(message);
      rejest(reject2);
    });
  }))();

  await FooReducer.barz();
  window.scroll(0, 0);
}

// ------------------------------------------------------

asyncFoo = async bar => {
  try {
    await FooReducer.postBar(bar);
  } catch (err) {
    toast(err.response.data.meta.message);
  }

  await FooReducer.barz();
  window.scroll(0, 0);
};

// ------------------------------------------------------