const [subscriptions, prices, products] = await Promise.all([{{actions.loadSubscriptions.trigger()}}, {{actions.loadPrices.trigger()}}, {{actions.loadProducts.trigger()}}]);

const dayDateString = (date) => new Date(date).toISOString().replace(/T.+$/, '');

const dates = sortedUniqueDates(subscriptions.flatMap(({ begin_timestamp, end_timestamp }) => [dayDateString(begin_timestamp), dayDateString(end_timestamp)]));

const newSubscriptions = dates.map((date) => ({
  date,
  count: subscriptions.filter(({ begin_timestamp }) => date === dayDateString(begin_timestamp)).length,
}));

const mostSubscribedProducts = Object.entries(
  subscriptions.reduce((histogram, { price_id }) => {
    const { product_id } = prices.find(({ id }) => id === price_id);
    histogram[product_id] = (histogram[product_id] ?? 0) + 1;
    return histogram;
  }, {})
)
  .sort((lhs, rhs) => lhs[1] - rhs[1])
  .map(([productId, occurrence]) => ({
    ...products.find(({ id }) => id === productId),
    occurrence,
  }));

return {
  newSubscriptions,
  mostSubscribedProducts,
};