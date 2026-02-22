import type { Provider } from "./providers";
import spidLogo from "./spid-ico-circle-bb.svg";
import cieLogo from "./logo_cie_id.svg";

/**
 * The endpoint for the relaying party that should receive the request,
 * based on the organization name
 */
export type RPEndpoint = (orgName: string) => string;

export type DialogInput = {
  lang: "en" | "it";
  providers: Provider[];
  rpEndpoint: RPEndpoint;
  targetSelf?: boolean;
  withDemo?: boolean;
  withValidator?: boolean;
};

/**
 * Returns the HTML for the SPID dialog
 * @param lang the language of the dialog (`en` or `it`)
 * @param providers the list of SPID providers
 * @param rpEndpoint the endpoint for the relaying party that should receive the request
 * @returns the HTML for the dialog
 */
export const renderDialog = (input: DialogInput) => {
  return /*html*/ `
    <dialog id="spid-dialog">
      <ul class="spid-providers">
      ${renderHelpLinks(input.lang)}
      ${renderProviders(input)}
      </ul>
    </dialog>
  `;
};

const renderHelpLinks = (lang: "en" | "it") => {
  if (lang === "en") {
    return /*html*/ `
      <li class="spid-idp-search">
        <input type="search" placeholder="Filter providers" />
        <a href="https://www.spid.gov.it/en" target="_blank">SPID?</a>
      </li>
    `;
  }
  if (lang === "it") {
    return /*html*/ `
      <li class="spid-idp-search">
      <input type="search" placeholder="Filtra provider" autofocus/>
        <a href="https://www.spid.gov.it" target="_blank">SPID?</a>
      </li>
    `;
  }
  throw new Error(`Language ${lang} not supported`);
};

type ProvidersInput = {
  providers: Provider[];
  rpEndpoint: RPEndpoint;
  withDemo?: boolean;
  withValidator?: boolean;
  targetSelf?: boolean;
};
/**
 * Returns the HTML for the list of SPID providers
 * @param providers the list of SPID providers
 * @returns the HTML for the list
 */
const renderProviders = (opts: ProvidersInput) => {
  let list = "";

  const extras = [];

  if (import.meta.env.VITE_SPID_DEVELOPMENT_MODE === "true" || opts.withDemo) {
    extras.push({ organization_name: "DEMO" });
  }
  if (opts.withValidator) {
    extras.push({ organization_name: "VALIDATOR" });
  }
  if (opts.withDemo && opts.withValidator) {
    extras.push({ organization_name: "DEMOVALIDATOR" });
  }

  for (const provider of extras) {
    list += /*html*/ `
    <li data-idp-name="${provider.organization_name}">
        <a href="${opts.rpEndpoint(provider.organization_name)}" 
            ${opts.targetSelf ? "" : 'target="_blank"'}>
            ${provider.organization_name}
        </a>
    </li>
    `;
  }

  for (const provider of opts.providers) {
    list += /*html*/ `
    <li data-idp-name="${provider.organization_name}">
        <a href="${opts.rpEndpoint(provider.organization_name)}" 
            ${opts.targetSelf ? "" : 'target="_blank"'}>
            <img src="${provider.logo_uri}" alt="${provider.organization_name}">
        </a>
    </li>
    `;
  }
  return list;
};

type SpidButtonInput = {
  lang: "en" | "it";
  type: "spid";
};

type CieButtonInput = {
  lang: "en" | "it";
  type: "cie";
  href: string;
};

export type ButtonInput = SpidButtonInput | CieButtonInput;

/**
 * Returns the HTML for a SPID or CIE button, based on the language.
 * SPID buttons open a provider dialog; CIE buttons link directly to the IdP.
 * @param lang the language of the button (`en` or `it`)
 * @param type the type of the button (`spid` or `cie`)
 * @returns the HTML for the button
 */
export const renderButton = (input: ButtonInput) => {
  const { lang, type } = input;
  if (lang === "en" && type === "spid") {
    return spidBtnTemplate(spidLogo, "SPID logo", "Enter via SPID");
  }
  if (lang === "it" && type === "spid") {
    return spidBtnTemplate(spidLogo, "Logo SPID", "Entra con SPID");
  }
  if (lang === "en" && type === "cie") {
    return cieBtnTemplate(input.href, cieLogo, "CIE logo", "Enter via CIE");
  }
  if (lang === "it" && type === "cie") {
    return cieBtnTemplate(input.href, cieLogo, "Logo CIE", "Entra con CIE");
  }
  throw new Error(`Language ${lang} not supported`);
};

const spidBtnTemplate = (logo: string, alt: string, label: string) => /*html*/ `
      <button class="spid-button" data-type="spid">
        <img src="${logo}" alt="${alt}" />
        <p>${label}</p>
      </button>
`;

const cieBtnTemplate = (href: string, logo: string, alt: string, label: string) => /*html*/ `
      <a class="spid-button" data-type="cie" href="${href}">
        <img src="${logo}" alt="${alt}" />
        <p>${label}</p>
      </a>
`;
