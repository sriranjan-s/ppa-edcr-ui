import axios from "axios";
const edcrInstance = axios.create({
  baseURL: "https://dev-test.chandigarhsmartcity.in",
  headers: {
    "Content-Type": "application/json"
  }
})
export const loginRequest = async (username = "user1", password = "pass@123", endpoint) => {
  let apiError = "Currently we are facing some issues. Please try again after some time.";
  var params = new URLSearchParams();
  username && params.append("username", "user1");
  password && params.append("password", "pass@123");
  params.append("grant_type", "password");
  try {
    const response = await fetch(`https://dev-test.chandigarhsmartcity.in/${endpoint}`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Authorization": "Basic ZWdvdi1yZXN0YXBpLWNsaWVudDplZ292LXJlc3RhcGktc2VjcmV0",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    const data = await response.json();
    console.log("TOKEN RESPONSE:", data);
    if (data) {
      return data
    }

  } catch (error) {
    const { data, status } = error.response;
    if (status === 400) {
      apiError = (data.hasOwnProperty("error_description") && data.error_description) || apiError;
    }
  }

  throw new Error(apiError);
};
export const edcrHttpRequest_ = async (action, res, endPoint, body = []) => {



  let apiError = "Currently we are facing some issues. Please try again after some time.";
  var params = new URLSearchParams();
  //let endpoint ='/edcr/oauth/token?tenantId=state'
  res && params.append("username", "6c935640-97c0-4543-a0bf-f9d897a22c88");
  params.append("grant_type", "password");
  let body_ = {
    "transactionNumber": "6c935640-97c0-4543-a0bf-f9d897a22c88",
    "applicationSubType": "NEW_CONSTRUCTION",
    "appliactionType": "PERMIT",
    "applicantName": "Test_01",
    "tenantId": "state",
    "RequestInfo": {
      "apiId": "1",
      "ver": "1",
      "ts": "01-01-2017 01:01:01",
      "action": "create",
      "did": "jh",
      "key": "",
      "msgId": "gfcfc",
      "correlationId": "wefiuweiuff897",
      "authToken": "b2f72e2d-b5c4-42b7-91c3-86813587e2cc",
      "userInfo": {
        "uuid": "6ff01d16-5ae9-49cd-ba55-7ea8f487a845"
      }
    }
  }
  const loginInstance = await axios.create({
    baseURL: "https://dev-test.chandigarhsmartcity.in",
    //baseURL: window.location.origin,
    headers: {
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic ZWdvdi11c2VyLWNsaWVudDplZ292LXVzZXItc2VjcmV0",
    },
    params
  });
  // userType && params.append("userType", userType);

  try {
    // fetch("https://cors-anywhere.herokuapp.com/https://ppa-demo.ddns.net/edcr/oauth/token?tenantId=state", ...)

    // const response = await fetch(`https://ppa-demo.ddns.net/${endPoint}`, {
    const response = await loginInstance.post("/edcr/oauth/token?tenantId=state", {
      // mode: "no-cors",
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Authorization": "Basic ZWdvdi1yZXN0YXBpLWNsaWVudDplZ292LXJlc3RhcGktc2VjcmV0",
        "Content-Type": "application/x-www-form-urlencoded",
        // Content-Type removed because FormData sets it automatically
      },
      body_,
    });
    if (response) {
      return response
    }
  } catch (error) {
    const { data, status } = error.response;
    if (status === 400) {
      apiError = (data.hasOwnProperty("error_description") && data.error_description) || apiError;
    }
  }

  throw new Error(apiError);
};
export const edcrHttpRequest = async (
  method = "post",
  payloadData,
  endPoint,
  headers = [],
  customRequestInfo = {},
  file
) => {

  let apiError = "No Record Found";
  let access_token = payloadData.access_token
  let edcrRequest = {
    transactionNumber: "",
    planFile: null,
    tenantId: "state",
    RequestInfo: {
      apiId: "1",
      ver: "1",
      ts: "01-01-2017 01:01:01",
      action: "create",
      did: "jh",
      key: "",
      msgId: "gfcfc",
      correlationId: "wefiuweiuff897",
      authToken: access_token,
      "userInfo": {
        "uuid": "6ff01d16-5ae9-49cd-ba55-7ea8f487a845"
      }
    }
  };
  if (headers)
    edcrInstance.defaults = Object.assign(edcrInstance.defaults, {
      headers
    });

  const isLayoutApproval = customRequestInfo.subtype === "Layout Approval";
  if (isLayoutApproval) {
    endPoint = "edcr/rest/dcr/layout/scrutinize?tenantId=state";
  } else {
    endPoint = "edcr/rest/dcr/scrutinizeplan";
  }
  var response;
  try {
    const id = crypto.randomUUID();
    const transactionNumber = id;
    let appliactionType = isLayoutApproval ? "LAYOUT_PERMIT" : (customRequestInfo.type || "PERMIT");
    let applicationSubType = isLayoutApproval ? "NEW_CONSTRUCTION" : customRequestInfo.subtype;
    let applicantName = customRequestInfo.name;

    edcrRequest = { ...edcrRequest, transactionNumber };
    edcrRequest = { ...edcrRequest, appliactionType };
    edcrRequest = { ...edcrRequest, applicationSubType };
    edcrRequest = { ...edcrRequest, applicantName };
    if (isLayoutApproval) {
      edcrRequest.architectInformation = "Sundar";
    }
    var bodyFormData = new FormData();
    bodyFormData.append("edcrRequest", JSON.stringify(edcrRequest));
    bodyFormData.append("planFile", file);
    response = await axios({
      method: "post",
      url: `https://dev-test.chandigarhsmartcity.in/${endPoint}`,
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...(access_token ? { "Authorization": `Bearer ${access_token}` } : {})
      }
    });
    if (response) {
      const responseStatus = parseInt(response.status, 10);

      if (responseStatus === 200 || responseStatus === 201) {
        return response.data;
      }
    }
  } catch (error) {
    const { data, status } = error.response;
    if (status === 400 && data === "") {
      apiError = "INVALID_TOKEN";
    } else if (status === 400 || status === 500) {
      apiError = data.errorDetails;
    } else if (status === 404) {
      apiError = "SCRUTINY_SERVER_DOWN_RETRY_AFTER_SOMETIME";
    } else if (status === 502) {
      apiError = "SERVER_ERROR_CONTACT_TO_SUJOG_ADMINISTRATOR";
    } else if (status === 503) {
      apiError = "SERVER_ERROR_CONTACT_TO_SUJOG_ADMINISTRATOR";
    } else if (status === 504) {
      apiError = "SERVER_ERROR_CONTACT_TO_SUJOG_ADMINISTRATOR";
    } else {
      apiError =
        (data.hasOwnProperty("Errors") &&
          data.Errors &&
          data.Errors.length &&
          data.Errors[0].message) ||
        (data.hasOwnProperty("error") &&
          data.error.fields &&
          data.error.fields.length &&
          data.error.fields[0].message) ||
        (data.hasOwnProperty("error_description") && data.error_description) ||
        apiError;
    }
    return data
  }
  throw new Error(apiError);
};