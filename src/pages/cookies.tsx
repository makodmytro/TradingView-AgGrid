import classnames from 'classnames';
import React from 'react';
import SEO from './components/SEO';
import styles from './PolicyPages.module.scss';

const Cookies = () => {
    return (
        <>
            <SEO
                title="AG Grid: Cookies Policy"
                description="This page outlines our policy in relation to the cookies that we collect on our website."
            />
            <div className={styles.policyPage}>
                <div className="page-margin">
                    <h1>Cookie Policy</h1>
                    <hr />

                    <section>
                        <header>
                            <div className={styles.introduction} id="introduction">
                                <h4>Effective Date: May 17, 2018</h4>
                            </div>

                            <nav>
                                <ul className="list-style-none">
                                    <li>
                                        <a href="#">Cookies Guide</a>
                                    </li>
                                    <li>
                                        <a href="#manage-your-cookie-consent">Manage Cookie Consent</a>
                                    </li>
                                    <li>
                                        <a href="#intro-privacy">What is a Cookie?</a>
                                    </li>
                                    <li>
                                        <a href="#cookies-how-we-use">How Do We Use Cookies?</a>
                                    </li>
                                    <li>
                                        <a href="#third-party-cookies">Third-party Cookies</a>
                                    </li>
                                </ul>
                            </nav>
                        </header>

                        <ol className={styles.policyList}>
                            <li>
                                {/*OneTrust CookiePro Details*/}
                                <h3 id="manage-your-cookie-consent">Manage Cookie Consent</h3>
                                <hr />
                                <p>
                                    You can manage your optin and optout cookie consent settings by clicking the button
                                    below.
                                </p>
                                <button
                                    id="ot-sdk-btn"
                                    className={classnames(styles.settingsButton, 'ot-sdk-show-settings')}
                                >
                                    Cookie Settings
                                </button>
                                <p>Details of the cookies we use are listed in the table below.</p>
                                <div id="ot-sdk-cookie-policy"></div>
                            </li>
                            <li>
                                <h3 id="intro-privacy">What is a Cookie?</h3>
                                <hr />
                                <p>
                                    A <strong>"cookie"</strong> is a piece of information that is stored on your
                                    computer's hard drive and which records how you move your way around a website so
                                    that, when you revisit that website, it can present tailored options based on the
                                    information stored about your last visit. Cookies can also be used to analyse
                                    traffic and for advertising and marketing purposes.
                                </p>
                                <p>Cookies are used by nearly all websites and do not harm your system.</p>
                                <p>
                                    If you want to check or change what types of cookies you accept, this can usually be
                                    altered within your browser settings. You can block cookies at any time by
                                    activating the setting on your browser that allows you to refuse the setting of all
                                    or some cookies. However, if you use your browser settings to block all cookies
                                    (including essential cookies) you may not be able to access all or parts of our
                                    site.
                                </p>
                            </li>
                            <li>
                                <h3 id="cookies-how-we-use">How Do We Use Cookies?</h3>
                                <hr />
                                <p>
                                    We use cookies to track your use of our website. This enables us to understand how
                                    you use the site and track any patterns with regards how you are using our website.
                                    This helps us to develop and improve our website as well as products and / or
                                    services in response to what you might need or want.
                                </p>
                                <h4>Cookies are either:</h4>
                                <ul>
                                    <li>
                                        <strong>Session cookies:</strong> these are only stored on your computer during
                                        your web session and are automatically deleted when you close your browser –
                                        they usually store an anonymous session ID allowing you to browse a website
                                        without having to log in to each page, but they do not collect any personal data
                                        from your computer; or
                                    </li>
                                    <li>
                                        <strong>Persistent cookies:</strong> a persistent cookie is stored as a file on
                                        your computer and it remains there when you close your web browser. The cookie
                                        can be read by the website that created it when you visit that website again. We
                                        use persistent cookies for Google Analytics.
                                    </li>
                                </ul>
                                <h4>Cookies can also be categorised as follows:</h4>
                                <ul>
                                    <li>
                                        <strong>Strictly necessary cookies:</strong> These cookies are essential to
                                        enable you to use the website effectively, such as when buying a product and /
                                        or service, and therefore cannot be turned off. Without these cookies, the
                                        services available to you on our website cannot be provided. These cookies do
                                        not gather information about you that could be used for marketing or remembering
                                        where you have been on the internet.
                                    </li>
                                    <li>
                                        <strong>Performance cookies:</strong> These cookies enable us to monitor and
                                        improve the performance of our website. For example, they allow us to count
                                        visits, identify traffic sources and see which parts of the site are most
                                        popular.
                                    </li>
                                    <li>
                                        <strong>Functionality cookies:</strong> These cookies allow our website to
                                        remember choices you make and provide enhanced features. For instance, we may be
                                        able to provide you with news or updates relevant to the services you use. They
                                        may also be used to provide services you have requested such as viewing a video
                                        or commenting on a blog. The information these cookies collect is usually
                                        anonymised.
                                    </li>
                                    <li>
                                        <strong>Targetting cookies:</strong> These cookies may be set through our site
                                        by our advertising partners. They may be used by those companies to build a
                                        profile of your interests and show you relevant adverts on other sites. They do
                                        not store directly personal information, but are based on uniquely identifying
                                        your browser and internet device. If you do not allow these cookies, you will
                                        experience less targeted advertising.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <h3 id="third-party-cookies">Third-party Cookies</h3>
                                <hr />
                                <p>
                                    Some of our pages display content from external sites, e.g. YouTube, StackBlitz. The
                                    embedding of content from these sites may create third-party cookies over which we
                                    have no control.
                                </p>

                                <p>
                                    To view this third-party content, you may have to accept their terms and conditions.
                                    This includes their cookie policies, over which we have no control.
                                </p>

                                <p>
                                    If you do not view this content, no third-party cookies are installed on your
                                    device.
                                </p>

                                <p>
                                    Third-party providers on AG Grid website and blogs include:
                                    <a href="https://stackblitz.com/privacy-policy" target="_blank" rel="noopener">
                                        {' '}
                                        StackBlitz
                                    </a>
                                    ,
                                    <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener">
                                        {' '}
                                        YouTube
                                    </a>
                                    ,
                                    <a href="https://www.atlassian.com/legal/cookies" target="_blank" rel="noopener">
                                        {' '}
                                        Atlassian
                                    </a>
                                    ,
                                    <a href="https://codesandbox.io/legal/privacy" target="_blank" rel="noopener">
                                        {' '}
                                        Code Sandbox
                                    </a>
                                    ,
                                    <a
                                        href="https://policies.google.com/terms?hl=en&gl=be"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        {' '}
                                        Google
                                    </a>
                                    ,
                                    <a
                                        href="https://www.linkedin.com/legal/user-agreement"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        {' '}
                                        LinkedIn
                                    </a>
                                    ,
                                    <a href="https://www.facebook.com/legal/terms" target="_blank" rel="noopener">
                                        {' '}
                                        Facebook
                                    </a>
                                    ,
                                    <a
                                        href="https://docs.github.com/en/github/site-policy/github-privacy-statement"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        {' '}
                                        Github
                                    </a>
                                    .
                                </p>

                                <p>
                                    These third-party services are outside of the control of AG Grid. Third Parties may,
                                    at any time, change their terms of service, purpose and use of cookies, etc.
                                </p>
                            </li>
                        </ol>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Cookies;
