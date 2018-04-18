const qs = require("query-string");
const axios = require("axios");
const methodEndpoints = require("./methodEndpoints");

class SmsAero {

	constructor(username, apiKey, responseFormat = "json") {
		this.responseFormat = responseFormat;
		this.gateWayUrl = "gate.smsaero.ru/v2/";
		this.username = username;
		this.apiKey = apiKey;
		this.endpoint = `https://${this.username}:${this.apiKey}@${this.gateWayUrl}`;
		this.axiosInstance = axios.create({
			baseURL: this.endpoint,
			timeout: 10000,
			headers: {
				"Accept": responseFormat === "json" ? "application/json" : "application/xml"
			}
		});
		this.request = this.axiosInstance.get;
	}

	send({
		number,
		numbers,
		sign,
		text,
		channel,
		dateSend,
		callbackUrl
	} = {}) {
		let query;

		if(number) {
			query = qs.stringify({ number, sign, text, channel, dateSend, callbackUrl })
		}

		if(numbers) {
			query = qs.stringify({numbers, sign, text, channel, dateSend, callbackUrl}, { arrayFormat: 'bracket' });
		}

		return this.request(`${methodEndpoints.sendSMS}?${query}`)
	}

	checkStatus(id) {
		if(!id) throw new Error("You must pass an id of message!");
		else id = parseInt(id);

		return this.request(`${methodEndpoints.checkStatus}?id=${id}`)
	}

	sendedList({
		number,
		text,
		page
	} = {}) {
		const query = qs.stringify({ number, text, page })

		return this.request(`${methodEndpoints.sendedList}?${query}`)
	}

	balance() {
		return this.request(`${methodEndpoints.balance}`)
	}

	tariffs() {
		return this.request(`${methodEndpoints.tariffs}`)
	}

	addSign(sign) {
		if(sign.length > 11) throw new Error("Sign length must be not more than 11 symbols!");

		return this.request(`${methodEndpoints.addSign}?name=${sign}`)
	}

	signList() {
		return this.request(`${methodEndpoints.signList}`)
	}

	addGroup(name) {
		return this.request(`${methodEndpoints.addGroup}?name=${name}`)
	}

	deleteGroup(id) {
		if(!id) throw new Error("You must pass an id of group!");
		else id = parseInt(id);

		return this.request(`${methodEndpoints.deleteGroup}?id=${id}`)
	}

	groupList(page = undefined) {
		return this.request(`${methodEndpoints.groupList}?page=${page !== undefined ? page : ''}`)
	}

	addContact({
		number,
		groupId,
		birthday,
		sex,
		lname,
		fname,
		sname,
		param1,
		param2,
		param3
	} = {}) {
		if(!number) throw new Error("You must provide at least number of contact!")

		const query = qs.stringify({
			number,
			groupId,
			birthday,
			sex,
			lname,
			fname,
			sname,
			param1,
			param2,
			param3
		})

		return this.request(`${methodEndpoints.addContact}?${query}`)
	}

	deleteContact(id) {
		if(!id) throw new Error("You must pass an id of contact!");
		else id = parseInt(id);

		return this.request(`${methodEndpoints.deleteContact}?id=${id}`)
	}

	contactList({
		number,
		groupId,
		birthday,
		sex,
		operator,
		lname,
		fname,
		sname,
		page
	} = {}) {

		const query = qs.stringify({
			number,
			groupId,
			birthday,
			sex,
			operator,
			lname,
			fname,
			sname,
			page
		})

		return this.request(`${methodEndpoints.contactList}?query=${query}`)
	}

	addBlacklist(number) {
		const query = typeof number === 'string'
			? number
			: qs.stringify(number, { arrayFormat: 'bracket' });

		const requestParams = typeof number === 'string'
			? `number=${number}`
			: `${query}`

		return this.request(`${methodEndpoints.addBlacklist}?${requestParams}`)
	}

	deleteBlacklist(id) {
		if(!id) throw new Error("You must pass an id of contact!");
		else id = parseInt(id);

		return this.request(`${methodEndpoints.deleteBlacklist}?id=${id}`)
	}

	blacklistList() {
		return this.request(`${methodEndpoints.blacklistList}`)
	}

	hlrCheck(number) {
		const query = typeof number === 'string'
			? number
			: qs.stringify(number, { arrayFormat: 'bracket' });

		const requestParams = typeof number === 'string'
			? `number=${number}`
			: `${query}`

		return this.request(`${methodEndpoints.hlrCheck}?${requestParams}`)
	}

	hlrStatus(id) {
		if(!id) throw new Error("You must pass an id of HLR check!");
		else id = parseInt(id);

		return this.request(`${methodEndpoints.hlrStatus}?id=${id}`)
	}

	checkOperator(number) {
		const query = typeof number === 'string'
			? number
			: qs.stringify(number, { arrayFormat: 'bracket' });

		const requestParams = typeof number === 'string'
			? `number=${number}`
			: `${query}`

		return this.request(`${methodEndpoints.checkOperator}?${requestParams}`)
	}

	sendViber({
		number,
		numbers,
		groupId,
		sign,
		channel,
		text,
		imageSource,
		textButton,
		linkButton,
		dateSend,
		signSms,
		channelSms,
		textSms,
		priceSms
	} = {}) {

		let query;

		if(number) {
			query = qs.stringify({ number, groupId, sign, channel, text, imageSource, textButton, linkButton, dateSend, signSms, channelSms, textSms, priceSms })
		}

		if(numbers) {
			query = qs.stringify({ groupId, sign, channel, text, imageSource, textButton, linkButton, dateSend, signSms, channelSms, textSms, priceSms });
			const numbersQuery = qs.stringify({ numbers }, { arrayFormat: 'bracket' })
			query = `${numbersQuery}&${query}`;
		}

		return this.request(`${methodEndpoints.sendViber}?${query}`)
	}

	checkViberStat(sendingId) {
		return this.request(`${methodEndpoints.checkViberStat}?sendingId=${sendingId}`)
	}

	viberList() {
		return this.request(`${methodEndpoints.viberList}`)
	}

	viberSignList() {
		return this.request(`${methodEndpoints.viberSignList}`)
	}
}