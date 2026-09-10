const KARASU_GA_MEASUREMENT_ID =
  'G-TTP4H9CQLL';

const KARASU_CONSENT_KEY =
  'karasu_analytics_consent';


function initializeGoogleAnalytics() {

  if (window.karasuAnalyticsInitialized) {
    return;
  }

  window.karasuAnalyticsInitialized = true;


  window.dataLayer =
    window.dataLayer || [];


  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(
        arguments
      );
    };


  window.gtag(
    'js',
    new Date()
  );


  window.gtag(
    'config',
    KARASU_GA_MEASUREMENT_ID,
    {
      send_page_view: true
    }
  );


  const script =
    document.createElement(
      'script'
    );

  script.async =
    true;

  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      KARASU_GA_MEASUREMENT_ID
    )}`;


  document.head.appendChild(
    script
  );

}


function getAnalyticsConsent() {

  try {

    return localStorage.getItem(
      KARASU_CONSENT_KEY
    );

  } catch {

    return null;

  }

}


function saveAnalyticsConsent(
  value
) {

  try {

    localStorage.setItem(
      KARASU_CONSENT_KEY,
      value
    );

  } catch {

    // If localStorage is unavailable,
    // continue without persisting consent.

  }

}


function removeConsentBanner() {

  const banner =
    document.getElementById(
      'karasu-consent-banner'
    );


  if (banner) {

    banner.remove();

  }

}


function createConsentBanner() {

  if (
    document.getElementById(
      'karasu-consent-banner'
    )
  ) {
    return;
  }


  const banner =
    document.createElement(
      'div'
    );


  banner.id =
    'karasu-consent-banner';


  banner.innerHTML = `
    <div class="karasu-consent-inner">

      <div class="karasu-consent-copy">

        <strong>
          Analytics preferences
        </strong>

        <p>
          Karasu uses Google Analytics
          to understand site usage and improve our guides.
          Analytics is only enabled if you accept.
          See our
          <a href="/privacy.html">
            Privacy Policy
          </a>.
        </p>

      </div>


      <div class="karasu-consent-actions">

        <button
          type="button"
          id="karasu-consent-decline"
          class="karasu-consent-button karasu-consent-secondary"
        >
          Decline
        </button>

        <button
          type="button"
          id="karasu-consent-accept"
          class="karasu-consent-button karasu-consent-primary"
        >
          Accept analytics
        </button>

      </div>

    </div>
  `;


  const style =
    document.createElement(
      'style'
    );


  style.textContent = `

    #karasu-consent-banner {
      position: fixed;
      right: 20px;
      bottom: 20px;
      left: 20px;
      z-index: 9999;
      margin: 0 auto;
      max-width: 920px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      background: #111923;
      box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
      color: #d8e1eb;
    }


    .karasu-consent-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 28px;
      padding: 20px 22px;
    }


    .karasu-consent-copy {
      min-width: 0;
    }


    .karasu-consent-copy strong {
      display: block;
      margin-bottom: 6px;
      color: #f3f7fb;
      font-size: 15px;
    }


    .karasu-consent-copy p {
      margin: 0;
      color: #9eabb9;
      font-size: 13px;
      line-height: 1.65;
    }


    .karasu-consent-copy a {
      color: #72b7ff;
      text-decoration: underline;
      text-underline-offset: 3px;
    }


    .karasu-consent-actions {
      display: flex;
      flex: 0 0 auto;
      gap: 10px;
    }


    .karasu-consent-button {
      min-height: 42px;
      padding: 0 15px;
      border-radius: 9px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
    }


    .karasu-consent-primary {
      border: 1px solid rgba(88, 169, 255, 0.4);
      background: rgba(88, 169, 255, 0.14);
      color: #82c0ff;
    }


    .karasu-consent-secondary {
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: transparent;
      color: #b7c2ce;
    }


    @media (max-width: 640px) {

      #karasu-consent-banner {
        right: 12px;
        bottom: 12px;
        left: 12px;
      }


      .karasu-consent-inner {
        align-items: stretch;
        flex-direction: column;
        gap: 16px;
        padding: 18px;
      }


      .karasu-consent-actions {
        width: 100%;
      }


      .karasu-consent-button {
        flex: 1;
      }

    }

  `;


  document.head.appendChild(
    style
  );


  document.body.appendChild(
    banner
  );


  document
    .getElementById(
      'karasu-consent-accept'
    )
    ?.addEventListener(
      'click',
      () => {

        saveAnalyticsConsent(
          'granted'
        );

        removeConsentBanner();

        initializeGoogleAnalytics();

      }
    );


  document
    .getElementById(
      'karasu-consent-decline'
    )
    ?.addEventListener(
      'click',
      () => {

        saveAnalyticsConsent(
          'denied'
        );

        removeConsentBanner();

      }
    );

}


function trackAffiliateClick(
  link
) {

  if (
    getAnalyticsConsent() !==
    'granted'
  ) {
    return;
  }


  if (
    typeof window.gtag !==
    'function'
  ) {
    return;
  }


  const programName =
    String(
      link.textContent || ''
    )
      .replace(
        /→/g,
        ''
      )
      .replace(
        /^Explore\s+/i,
        ''
      )
      .trim();


  window.gtag(
    'event',
    'affiliate_click',
    {

      program_name:
        programName ||
        'unknown',

      link_url:
        link.href,

      page_path:
        window.location.pathname,

      page_title:
        document.title

    }
  );

}


function registerAffiliateTracking() {

  document.addEventListener(
    'click',
    event => {

      const target =
        event.target;


      if (
        !(target instanceof Element)
      ) {
        return;
      }


      const link =
        target.closest(
          'a'
        );


      if (!link) {
        return;
      }


      const relValues =
        String(
          link.getAttribute(
            'rel'
          ) || ''
        )
          .toLowerCase()
          .split(/\s+/);


      const isAffiliate =
        relValues.includes(
          'sponsored'
        );


      if (!isAffiliate) {
        return;
      }


      trackAffiliateClick(
        link
      );

    }
  );

}


function startKarasuAnalytics() {

  registerAffiliateTracking();


  const consent =
    getAnalyticsConsent();


  if (
    consent === 'granted'
  ) {

    initializeGoogleAnalytics();

    return;

  }


  if (
    consent === 'denied'
  ) {

    return;

  }


  createConsentBanner();

}


if (
  document.readyState ===
  'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    startKarasuAnalytics
  );

} else {

  startKarasuAnalytics();

}
