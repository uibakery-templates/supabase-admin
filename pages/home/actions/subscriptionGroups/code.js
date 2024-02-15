const validSubscriptions = {{data}}.filter(({ status }) => /(active|canceled)/.test(status));

const maxDuration = Math.ceil(validSubscriptions.reduce((acc, c) => Math.max(acc, c.duration), 0));

const result = [];

for (let i = 0; i < 10; i++) {
  const min = i / 10;
  const max = (i + 1) / 10;
  result.push({
  	duration: `${(min * maxDuration).toFixed(2)}-${(max * maxDuration).toFixed(2)} years`,
    countSubscriptions: 0,
  });
}

validSubscriptions.forEach(s => {
	result[Math.floor(s.duration / maxDuration * 10)].countSubscriptions++;
})

return result;