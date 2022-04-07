//const { Verify } = require('crypto')
const { XummSdk } = require("xumm-sdk");
const { Txdata, TxData } = require("xrpl-txdata");

const Sdk = new XummSdk(
  "3551c627-77e9-4cd3-9150-543876179020",
  "9c6e4f5e-5674-4c4e-89f8-d59b7e5c5055"
); //'Your-API-Id', 'Your-API-Secret'
const Verify = new TxData();

const main = async () => {
  // 내 계정 정보 확인
  //const appInfo = await Sdk.ping()
  //console.log(appInfo)  // appInfo.application.name => 내 xumm project name
  // 내 계정 정보 확인

  // xumm이 지원하은 코인정보
  //const IOU = await Sd k.getCuratedAssets()
  //console.log(IOU)
  // xumm이 지원하은 코인정보

  const request = {
    txjson: {
      TransactionType: "Payment",
      Destination: "rh5zwiDfwY6ZqAQQbdzfFPxH79nHj28hdu", //실제 내주소   rUQJ88DMWt5BvgtKBAJV3iY2kcN8zc37s
      Amount: "1000000", // 백만개가 1개이다. }
    },
    user_token: "c903ab4d-c1ef-4c4c-842e-abc8cdf68834", // 사용자 토큰을 알면 핸드폰에 Push 할수 있다. 유저토크 알는 방법은 아래에 있다.
  };

  // 보낼때
  //const payload = await Sdk.payload.create(request,true)
  //console.log(payload)
  // 보낼때

  const subscription = await Sdk.payload.createAndSubscribe(
    request,
    (event) => {
      console.log("New Payload event", event.data);
      if (Object.keys(event.data).indexOf("signed") > -1) return event.data;
    }
  );
  console.log("subscription : ", subscription.created.next.always); // 전체 정보 나오는 큐알코드 나오는 URL
  //console.log("subscription : ", subscription.created.refs.qr_png)  // 큐알코드 그림만 나오는  URL
  console.log("Pushed", subscription.created.pushed ? "YES" : "No");

  const resolveData = await subscription.resolved; //  큐알코드 처리 될때 까지 기다려서 받은 데이타.
  if (resolveData.siged == false) {
    console.log("The sign was rejecte");
  } else {
    //console.log('The sign was Signeds')
    const result = await Sdk.payload.get(resolveData.payload_uuidv4);
    //console.log('User Token', result.application.issued_user_token)
    const VerifiedResult = await Verify.getOne("result.result.txid"); //main net 사용할때 반드시
    //console.log('Tansaction Id', result.result.txid)
    console.log("On ledger Balance", VerifiedResult); //
    console.log("On ledger Balance", VerifiedResult.balanceChanges); // 계정의  변동내역을 보여줌
  }
  return "<h1>hi</h1>"//subscription.created.refs.qr_png;
};

main();
