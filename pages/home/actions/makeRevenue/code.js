const [products, prices, subscriptions] = await Promise.all([{{actions.loadProducts.trigger()}}, {{actions.loadPrices.trigger()}}, {{actions.loadSubscriptions.trigger()}}]);

const monthDateString = (date) => new Date(date).toISOString().replace(/-\d\dT.+$/, '');

const revenues = subscriptions
  .filter(({ status }) => /(active|canceled)/.test(status))
  .map(({ price_id, begin_timestamp, end_timestamp }) => {
    const { price, pricing, pricing_plan, rate, currency, product_id } = prices.find(({ id }) => id === price_id);
    const usdPrice = price / rate;
    const dateDiffFor = dateDiff(monthDateString(end_timestamp), monthDateString(begin_timestamp));
    const numberOfPayments = pricing === 'one_time' ? 1 : dateDiffFor(pricing_plan);
    return {
      revenue: usdPrice * Math.ceil(numberOfPayments),
      currency,
      date: monthDateString(end_timestamp),
      product_id,
    };
  });

const dates = sortedUniqueDates(revenues.map(({ date }) => date));

const makeRevenueData = (revenues) => {
  const revenueData = Array(dates.length).fill(0);

  for (let i = 0, subTotal = 0; i < revenues.length; ++i) {
    subTotal += revenues[i].revenue;

    const current = dates.indexOf(revenues[i].date);
    const next = i + 1 < revenues.length ? dates.indexOf(revenues[i + 1].date) + 1 : dates.length;

    revenueData.fill(subTotal, current, next);
  }

  return revenueData;
};

const revenueByCurrencySeries = Object.entries(Object.groupBy(revenues, ({ currency }) => currency)).map(([currency, revenues]) => ({
  name: currency,
  type: 'line',
  stack: 'total',
  smooth: false,
  itemStyle: {},
  lineStyle: {},
  areaStyle: {},
  emphasis: {
    focus: 'series',
  },
  data: makeRevenueData(revenues),
}));

const revenueByProductSeries = Object.entries(Object.groupBy(revenues, ({ product_id }) => product_id)).map(([product_id, revenues]) => ({
  name: products.find(({ id }) => id === product_id).name,
  type: 'line',
  stack: 'total',
  smooth: false,
  itemStyle: {},
  lineStyle: {},
  areaStyle: {},
  emphasis: {
    focus: 'series',
  },
  data: makeRevenueData(revenues),
}));

return {
  revenueByCurrencySeries,
  revenueByProductSeries,
  xAxies: dates,
};