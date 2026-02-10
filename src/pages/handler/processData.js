let IDUser = 0;
let nextScreen;
const spinner = new Spinner();
const tableSection = document.getElementById("tableView");

const activeScannerScreen = function () {
  activeSection("scannerScreen");
  html5QrcodeScanner = new Html5QrcodeScanner("scannerScreen", {
    fps: 10,
    qrbox: 250,
    aspectRatio: 1,
  });
  html5QrcodeScanner.render(onScanSuccess, onScanError);
};

async function onScanSuccess(qrCodeMessage) {
  IDUser = (qrCodeMessage).trim();
  html5QrcodeScanner.clear();
  await processFind(qrCodeMessage);
}

async function onCodeSuccess(codeMessage) {
  if (!codeMessage) return;
  IDUser = codeMessage.trim();
  await processFind(codeMessage);
}

function onScanError(errorMessage) {
  //handle scan error
}

const processFind = async (query) => {
  spinner.on();
  const routeActive = getRouteActive();
  const moduleActive = localStorage.getItem("module");
  disableSection(routeActive);

  const response = (await getResponseBasedOnRoute(routeActive, query) || { status: 500});

  switch (response.status) {
    case 200:
      if (response.data.data.totalDocs === 0) {
        nextScreen = "notContent";
        break;
      }

      if (
        routeActive === "nameRoute" ||
        routeActive === "churchRoute" ||
        routeActive === "tableView"
      ) {
        const users = response.data.data.docs;
        manipulateAllData(users);
        nextScreen = "tableView";
        setCssExtendContent();
      } else {
        const user = response.data.data;
        let displayMethod;

        moduleActive === "checkin"
          ? (displayMethod = "simplify")
          : (displayMethod = "complete");

        manipulateSingleData(displayMethod, user);

        if (displayMethod == "complete") {
          nextScreen = "camperViewComplete";
          setCssExtendContent();
        } else {
          nextScreen = "camperViewSimplify";
          setCssExtendContent();
          //setCssDefaultContent();
        }
      }
      break;

    case 401:
      nextScreen = "unauthorized";
      break;

    case 404:
      nextScreen = "notFound";
      break;

    case 500:
      nextScreen = "serverError";
      break;

    default:
      console.log("Error");
      nextScreen = "serverError";
      break;
  }

  spinner.off();
  nextStep(nextScreen);
};

const getResponseBasedOnRoute = async (routeActive, query) => {
  let response;

  switch (routeActive) {
    case "nameRoute":
      response = await getAllUsers(`search=${encodeURIComponent(query)}&orderBy=name`);
      break;

    case "churchRoute":
      response = await getUsersByChurch(query);
      break;

    case "tableView":
      response = await getAllUsers(query);
      break;

    default:
      response = await getUserById(query);
      break;
  }

  return response;
};

const confirmCheckin = async () => {
  spinner.on();
  localStorage.getItem("module") === "checkin"
    ? disableSection("camperViewSimplify")
    : disableSection("camperViewComplete");
  const response = await registerCheckin(IDUser);

  switch (response.status) {
    case 201:
      nextScreen = "checkinSuccess";
      setCssDefaultContent();
      break;

    case 401:
      nextScreen = "unauthorized";
      break;

    case 500:
      nextScreen = "serverError";
      break;

    default:
      nextScreen = "serverError";
      console.log("Error");
      break;
  }

  spinner.off();
  nextStep(nextScreen);
};

const confirmCheckout = async () => {
  spinner.on();
  localStorage.getItem("module") === "checkin"
    ? disableSection("camperViewSimplify")
    : disableSection("camperViewComplete");
  const response = await registerCheckout(IDUser);

  switch (response.status) {
    case 201:
      nextScreen = "checkoutSuccess";
      setCssDefaultContent();
      break;

    case 401:
      nextScreen = "unauthorized";
      break;

    case 500:
      nextScreen = "serverError";
      break;

    default:
      console.log("Error");
      break;
  }

  spinner.off();
  nextStep(nextScreen);
};

const camperView = async (id) => {
  let idSimplify = id.split("-")[1];
  spinner.on();
  disableSection("tableView");
  const response = await getUserById(idSimplify);

  switch (response.status) {
    case 200:
      const user = response.data.data;
      IDUser = user.id;
      manipulateSingleData("complete", user);
      nextScreen = "camperViewComplete";
      setCssExtendContent();
      break;

    case 401:
      nextScreen = "unauthorized";
      break;

    case 404:
      nextScreen = "notFound";
      break;

    case 500:
      nextScreen = "serverError";
      break;

    default:
      console.log("Error");
      break;
  }

  spinner.off();
  nextStep(nextScreen);
};

const renderTable = async () => {
  spinner.on();
  await processFind("checkin=true");
};

const findCamperByChurch = async (church) => {
  if (!church) return;
  disableSection("churchRoute");
  spinner.on();
  await processFind(`${church}`);
};
