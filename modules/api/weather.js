const request = require("request-promise");
const { makeURL } = require("../data");

const weathers = ["🌧️", "☀️"];

const apiOption = {
	apikey: process.env.API_KEY_WEATHER,
	language: "vi",
	details: true,
	metric: true,
};
const location = "3554442",
	host = "dataservice.accuweather.com",
	path = ["/forecasts/v1/daily/1day/", "/currentconditions/v1/"];

function requestWeather(type, local) {
	if (type == 1) apiOption.details = false;
	else apiOption.details = true;
	const uri = makeURL(host, path[type] + local, apiOption);

	const options = {
		resolveWithFullResponse: true,
		simple: false,
		uri: uri,
		method: "GET",
		transform: (body) => JSON.parse(body),
	};
	return request(options);
}

async function getForecast(local = location) {
	const data = await requestWeather(0, local);

	if (data.Code == "ServiceUnavailable")
		return { status: false, msg: data.Message };
	const [current] = await requestWeather(1, local);
	const { DailyForecasts } = data,
		[{ AirAndPollen, Day, Temperature }] = DailyForecasts,
		[AirQuality] = AirAndPollen;
	console.log("get forecast");
	return {
		status: true,
		airQuality: AirQuality.Category,
		Temperature: Temperature,
		TemperatureCurrent: current.Temperature.Metric.Value,
		ShortPhrase: Day.ShortPhrase,
		HasPrecipitation: Day.HasPrecipitation,
	};
}

module.exports = {
	weatherReply: async () => {
		try {
			console.log("call weather api");
			const data = await getForecast();
			if (!data.status) return "⚠️ API thời tiết không khả dụng.";
			return [
				"🌤 THỜI TIẾT Q.10 HÔM NAY",
				temperatureMessage(
					data.Temperature,
					data.TemperatureCurrent
				),
				ShortPhrase(data.ShortPhrase, data.HasPrecipitation),
				AirQualityMessage(data.airQuality),
			].join("\n\n");
		} catch (e) {
			console.log(e);
			return "⚠️ Xảy ra lỗi với API thời tiết.";
		}
	},
	today: () => {
		var td = new Date();
		const h = td.getUTCHours() + 7,
			m = td.getUTCMinutes(),
			s = td.getSeconds(),
			ms = td.getUTCMilliseconds();
		return new Date(td.setUTCHours(h, m, s, ms));
	},
};

function AirQualityMessage(status) {
	return `🏭 Chất Lượng kk: ${status}.`;
}

function ShortPhrase(text, isRain) {
	return `${weathers[+isRain]} ${text}.`;
}

function temperatureMessage({ Minimum, Maximum }, current) {
	const v1 = Math.round(Minimum.Value),
		v2 = Math.round(Maximum.Value),
		cur = Math.round(current);
	return `🌡️ Nhiệt Độ: ${cur}°C / ${v1}-${v2}°C.`;
}
