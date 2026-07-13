import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * GA4 gtag — loads only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set at build
 * time (static export inlines the value). Omit the env var in local/dev builds
 * to keep analytics off; set it in CI/hosting for production.
 */
export function Analytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  );
}
