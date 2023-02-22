import fetch from "node-fetch";
import dotenv from "dotenv";
import json2csv from "json2csv";
import fs from "fs";

dotenv.config();

const baseUrl = "https://api.myngp.com/v2";

const params = {
  headers: {
    apiKey: process.env.API_KEY,
    "content-type": "application/json",
  },
  method: "GET",
};

async function getEmails() {
  const url = baseUrl + "/broadcastEmails";

  try {
    const data = await fetch(url, params);
    return data.json();
  } catch (err) {
    console.error(err);
  }
}

async function getEmailStats(emailID) {
  const url = baseUrl + "/broadcastEmails/" + emailID + "?$expand=statistics";

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

async function getEmailVariantStats(emailID, variantID) {
  const url =
    baseUrl +
    "/broadcastEmails/" +
    emailID +
    "/variants/" +
    variantID +
    "?$expand=statistics";

  try {
    const data = await fetch(url, params);
    return data.json();
  } catch (err) {
    console.error(err);
  }
}

async function getAllBestVariantsAndFormat(emails) {
  return await Promise.all(
    emails.map(async (email) => {
      const variants = await Promise.all(
        email.variants.map(async (variant) => {
          const data = await getEmailVariantStats(
            email.emailMessageId,
            variant.emailMessageVariantId
          );

          return { name: data.name, opens: data.statistics.opens };
        })
      );

      const max = getBestVariantOpen(variants);
      email.top_variant = max.name;
      return formatEmailStats(email);
    })
  ).then((res) => {
    return res;
  });
}

function getBestVariantOpen(variants) {
  return variants.reduce(
    (prev, current) => (prev.opens > current.opens ? prev : current),
    0
  );
}

function formatEmailStats(emailStats) {
  return {
    "Email Message ID": emailStats.emailMessageId,
    "Email Name": emailStats.name,
    Recipients: emailStats.statistics.recipients,
    Opens: emailStats.statistics.opens,
    Clicks: emailStats.statistics.clicks,
    Unsubscribes: emailStats.statistics.unsubscribes,
    Bounces: emailStats.statistics.bounces,
    "Top Variant": emailStats.top_variant,
  };
}

async function getFormattedCSV() {
  const emails = await getEmails();
  const emailStats = await getAllEmailStats(emails);
  const emailsWithTopVariant = await getAllBestVariantsAndFormat(emailStats);

  emailsWithTopVariant.sort((a, b) => sortEmailsByID(a, b));
  const fileName = "EmailReport.csv";
  const csvData = json2csv.parse(emailsWithTopVariant);
  fs.writeFile(fileName, csvData, (err) => {
    if (err) throw err;
    console.log("Email report complete, file is EmailReport.csv");
  });
}

function sortEmailsByID(a, b) {
  return a["Email Message ID"] > b["Email Message ID"] ? -1 : 1;
}

getFormattedCSV();
