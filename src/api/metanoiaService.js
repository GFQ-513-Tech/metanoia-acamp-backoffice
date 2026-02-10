const userModule = "users";
const reportModule = "reports";
const frontDeskModule = "frontdesk";

const getAllUsers = async (params) => {
  return apiRequest({
    path: `/${userModule}`,
    query: params,
  });
}

const getUserById = async (userId) => {
  return apiRequest({
    path: `/${userModule}/${encodeURIComponent(userId)}`,
  });
}

const getUsersByChurch = async (churchId) => {
  return apiRequest({
    path: `/${reportModule}/resume-by-church/${encodeURIComponent(churchId)}`,
  });
}

const registerCheckin = async (userId) => {
  return apiRequest({
    method: "POST",
    path: `/${frontDeskModule}/checkin/${encodeURIComponent(userId)}`,
  });
}

const registerCheckout = async (userId) => {
  return apiRequest({
    method: "POST",
    path: `/${frontDeskModule}/checkout/${encodeURIComponent(userId)}`,
  });
}