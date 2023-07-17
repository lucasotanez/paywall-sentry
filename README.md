<p align="center">
    <img src="https://github.com/lucasotanez/paywall-sentry/blob/main/public/img/ps-icon128.png?raw=true"/>
</p>

<h1 align="center"> 🔍 Paywall Sentry 🔍</h3>

<p align="center">A lightweight browser extension that offers helpful highlighting on 
Google search results which contain content locked behind paywalls or subscription fees. 
Save time and avoid clicking on unhelpful links. 🔒</p>

## :package: Installation
> intended for the Google Chrome browser

- Navigate to [Paywall Sentry](replaceWithPsLink) on the Chrome web store
- Or navigate to the [extension store](https://chrome.google.com/webstore/category/extensions)
and search for "Paywall Sentry"
- Click "Add to Chrome"
- That's it! The extension will automatically detect search results that require
subscriptions and warn you accordingly.

## :zap: Usage
The extension detects and flags all paywalled sites out of the box. There are 2 classes
of paywalls:
- **Soft**: Denoted by a **[❗]** icon and a *yellow* link color. Soft paywalls allow
free use for a limited time. For example a news outlet with a soft paywall may allow users
to read 5 free articles before demanding a subscription.
- **Hard**: Denoted by a **[✘]** icon and a *red* link color. Hard paywalls are stricter
than soft paywalls and do not allow any access without a subscription.

## :v: Configuration
If you have active subscriptions for certain websites that may be flagged by Paywall
Sentry, you can add them in the extension options:

- Click the extensions icon in the top right of your browser (the puzzle piece icon)
- Click the three dots next to Paywall Sentry
- Select "Options"
- In the options page, you can enter the base url of any subscriptions you may have. <br>
For example, if you own a Chegg subscription, you would input "www.chegg.com" (without quotes)
- Now, search results that contain the url you specified will not be flagged.
