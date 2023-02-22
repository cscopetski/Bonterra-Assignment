import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const params = {
  headers: {
    apiKey: process.env.API_KEY,
    "content-type": "application/json",
  },
  method: "GET",
};

async function getEmails() {
  const url = process.env.BASE_URL + "/broadcastEmails";

  try {
    const data = await fetch(url, params);
    return data.json();
  } catch (err) {
    console.error(err);
  }
}

async function getEmailStats(emailID) {
  const url =
    process.env.BASE_URL +
    "/broadcastEmails/" +
    emailID +
    "?$expand=statistics";

  try {
    const data = await fetch(url, params);
    return data.json();
  } catch (err) {
    console.error(err);
  }
}

async function getAllEmailStats(emails) {
  return await Promise.all(
    emails.items.map(async (email) => {
      return await getEmailStats(email.emailMessageId);
    })
  ).then((res) => {
    return res;
  });
}

getEmails().then((data) => {
  console.log(data);
  getAllEmailStats(data).then((data) => {
    console.log(data);
  });
});
