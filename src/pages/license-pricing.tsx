import classnames from 'classnames';
import ukraineFlagSVG from 'images/ukraine-flag.svg';
import React, { useEffect } from 'react';
import { Icon } from '../components/Icon';
import { InfoEmailLink } from '../components/InfoEmailLink';
import { Licenses } from '../components/licenses/Licenses';
import NPMIcon from '../images/inline-svgs/npm.svg';
import { trackOnceInfoEmail } from '../utils/analytics';
import { hostPrefix } from '../utils/consts';
import SEO from './components/SEO';
// @ts-ignore
import styles from './license-pricing.module.scss';

const LicensePricing = () => {
    useEffect(() => {
        const onSelectionChange = () => {
            const selection = document.getSelection()?.toString();
            if (selection?.includes('info@ag-grid.com')) {
                trackOnceInfoEmail({
                    type: 'selectedEmail',
                });
            }
        };
        document.addEventListener('selectionchange', onSelectionChange);

        return () => {
            document.removeEventListener('selectionchange', onSelectionChange);
        };
    });

    return (
        <div className={classnames('page-margin', styles.container)}>
            <div className={styles.topSection}>
                <div className={styles.intro}>
                    <h1>AG Grid Licences</h1>

                    <p className="font-size-large">
                        Get in touch and start a conversation. We can provide quotes, give bulk pricing, and answer any
                        sales or contract-related questions you may have.
                    </p>

                    <p className={styles.salesEmail}>
                        <InfoEmailLink isButton withIcon className="font-size-extra-large" trackingType="headerButton">
                            info@ag-grid.com
                        </InfoEmailLink>
                    </p>

                    <div className={styles.videoPrompt}>
                        <a href="#video-explainer" className={styles.thumbnail}>
                            <img
                                src="https://img.youtube.com/vi/20SLdu4wLtI/hqdefault.jpg"
                                alt="AG Grid license explained video"
                            />
                        </a>

                        <div>
                            <h3>Which licenses do I need?</h3>
                            <p>
                                <a href="#video-explainer">
                                    <span className="icon"></span>
                                    Watch our short explainer video
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                <Licenses />
            </div>

            <div className={styles.bulkLicenses}>
                <p className="text-secondary">
                    Bulk pricing discounts available. Use the buy now buttons above to see pricing for up to 10
                    developers. For more than 10 developers or any questions regarding your purchase, please email us.
                </p>

                <InfoEmailLink
                    emailSubject="AG Grid Developer license query"
                    className="font-size-massive"
                    trackingType="bulkDiscount"
                >
                    info@ag-grid.com
                </InfoEmailLink>
            </div>

            <div className={styles.communityEnterprise}>
                <div className={styles.community}>
                    <h3>AG Grid Community</h3>
                    <p>
                        <b>AG Grid Community</b> and <b>AG Charts Community</b> (a.k.a.{' '}
                        <a href={`${hostPrefix}/javascript-charts/overview/`} target="_blank">
                            Standalone Charts
                        </a>
                        ) are free and open source products distributed under the{' '}
                        <a href={`${hostPrefix}/eula/AG-Grid-Community-License.html`} target="_blank">
                            MIT License
                        </a>
                        . These versions are free to use in production environments.
                    </p>

                    <a
                        href="https://www.npmjs.com/package/ag-grid-community"
                        className={classnames(styles.NpmButton, 'button-secondary')}
                    >
                        <NPMIcon /> Get AG Grid Community at NPM
                    </a>
                    <br />
                    <a
                        href="https://www.npmjs.com/package/ag-charts-community"
                        className={classnames(styles.NpmButton, 'button-secondary')}
                    >
                        <NPMIcon /> Get AG Grid Charts at NPM
                    </a>
                </div>

                <div className={styles.enterprise}>
                    <h3>
                        AG Grid Enterprise <Icon name="enterprise" />
                    </h3>
                    <p>
                        <b>AG Grid Enterprise</b> offers advanced functionality like{' '}
                        <a href={`${hostPrefix}/javascript-data-grid/grouping/`} target="_blank">
                            Row Grouping
                        </a>
                        ,{' '}
                        <a href={`${hostPrefix}/javascript-data-grid/range-selection/`} target="_blank">
                            Range Selection
                        </a>
                        ,{' '}
                        <a href={`${hostPrefix}/javascript-data-grid/master-detail/`} target="_blank">
                            Master / Detail
                        </a>
                        ,{' '}
                        <a href={`${hostPrefix}/javascript-data-grid/server-side-model/`} target="_blank">
                            Server Side Row Model
                        </a>{' '}
                        and{' '}
                        <a href={`${hostPrefix}/javascript-data-grid/licensing/#feature-comparison`} target="_blank">
                            much much more
                        </a>
                        . <b>AG Grid Enterprise</b> also comes with{' '}
                        <a href={`${hostPrefix}/javascript-data-grid/integrated-charts/`} target="_blank">
                            Integrated Charts
                        </a>
                        , allowing your users to create charts using the grid's UI.
                    </p>

                    <p>
                        <b>AG Grid Enterprise</b> is a commercial product distributed under our{' '}
                        <a href={`${hostPrefix}/eula/AG-Grid-Enterprise-License-Latest.html`} target="_blank">
                            EULA
                        </a>{' '}
                        and supported by our technical staff. To evaluate <b>AG Grid Enterprise</b> you don't need our
                        permission – all features are unlocked. To temporarily hide the watermark and browser console
                        errors e-mail us to{' '}
                        <InfoEmailLink
                            emailSubject="AG Grid Trial license request"
                            trackingType="enterpriseEvaluationKey"
                        >
                            get a temporary evaluation key
                        </InfoEmailLink>
                        .
                    </p>

                    <p>
                        Once you're ready to begin development, please purchase an appropriate license key from the
                        options above.
                    </p>

                    <p>
                        Expanded definitions are available further down the page. For any other questions please{' '}
                        <InfoEmailLink
                            emailSubject="AG Grid Developer license query"
                            trackingType="enterpriseGetInContact"
                        >
                            get in contact
                        </InfoEmailLink>
                        .
                    </p>

                    <a
                        href={`${hostPrefix}/javascript-data-grid/licensing/#feature-comparison`}
                        className="button-secondary"
                    >
                        See all AG Grid Enterprise features
                    </a>
                </div>
            </div>

            <div className={styles.ukraineNotice}>
                <img src={ukraineFlagSVG} alt="flag of Ukraine" />

                <p className="text-secondary font-size-small">
                    In light of current events in Ukraine we are choosing to express our disappointment in the breakdown
                    of diplomacy, and its effects on the people of Ukraine, the global economy and community by not
                    licensing software to companies or individuals registered or residing in the Russian Federation.
                </p>
            </div>

            <div className={styles.videoExplainer} id="video-explainer">
                <div>
                    <h3 className="font-size-massive">Questions about our licenses? </h3>
                    <p>
                        Watch our short video for an in-depth look at exactly how each AG Grid license works. Learn
                        which license is right for you, how many licenses you need for your team, and exactly when you
                        need a deployment license.
                    </p>
                    <p>
                        If you have any other questions, or want to investigate volume pricing please{' '}
                        <InfoEmailLink
                            emailSubject="AG Grid Developer license query"
                            trackingType="questionsGetInContact"
                        >
                            get in contact
                        </InfoEmailLink>
                        .
                    </p>
                </div>

                <iframe
                    src="https://www.youtube.com/embed/20SLdu4wLtI"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>

            <div className={styles.licensesInDetail}>
                <h3 className="font-size-massive">Our Licenses in Depth</h3>

                <div
                    className={classnames(styles.singleApplicationLicense, 'card', 'single-application')}
                    id="single-application"
                >
                    <header>
                        <h3>Single Application Development License</h3>
                    </header>
                    <div className="content">
                        <p>
                            Licenses one application, developed for internal use, to embed AG Grid Enterprise in
                            perpetuity.
                        </p>
                        <ul>
                            <li>Includes a 1-year subscription to new versions, support and maintenance.</li>
                            <li>For customer-facing applications you will also need a Deployment License add-on.</li>
                            <li>
                                All concurrent, front-end, JavaScript developers working on the Application would need
                                to be added to the license count, not just the ones working with AG Grid.
                            </li>
                            <li>
                                Developers within the Single Application Development License count are unnamed, so long
                                as the total licensed count isn’t exceeded.
                            </li>
                            <li>
                                Single Application Development Licenses are bound to an application name and can’t be
                                reused on other applications.
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    className={classnames(styles.multipleApplicationsLicense, 'card', 'multiple-application')}
                    id="multiple-application"
                >
                    <header>
                        <h3>Multiple Application Development License</h3>
                    </header>
                    <div className="content">
                        <p>
                            Licenses unlimited number of applications, developed for internal use, to embed AG Grid
                            Enterprise in perpetuity.
                        </p>
                        <ul>
                            <li>Includes a 1-year subscription to new versions, support and maintenance.</li>
                            <li>For customer-facing applications you will also need a Deployment License add-on.</li>
                            <li>
                                All concurrent, front-end, JavaScript developers working across the licensed
                                Applications would need to be added to the license count, not just the ones working with
                                AG Grid.
                            </li>
                            <li>
                                Developers within the Multiple Application Development License count are unnamed, so
                                long as the total licensed count isn’t exceeded.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={classnames(styles.deploymentLicense, 'card')} id="deployment">
                    <header>
                        <h3>Deployment License Add-on</h3>
                    </header>
                    <div className="content">
                        <p>
                            Allows licensed developers to sub-license AG Grid for one application on one production
                            environment in perpetuity. Includes a 1-year subscription to new versions, support and
                            maintenance. Only available with a Developer License.
                        </p>
                        <ul>
                            <li>
                                A Deployment License Add-on allows making a project available to individuals (eg your
                                customers) outside of your organisation (sub-license).
                            </li>
                            <li>One Deployment License Add-on covers one production environment for one project.</li>
                            <li>
                                Only production environments require licensing. All other environments (eg development,
                                test, pre-production) do not require a license.
                            </li>
                            <li>
                                We do not charge per server. A cluster of many servers part of one application
                                installation is considered one deployment and requires one Deployment License. This is
                                true so long as the application instances within the cluster are replicas of each other
                                and server provides load balancing and fail over only.
                            </li>
                            <li>
                                Production failover deployments do not need to be licensed separately. They are
                                considered part of the overall application production deployment.
                            </li>
                            <li>
                                Multi-tenant deployments, where one application instance is serving many customers over
                                different URLs, is considered one deployment, as each tenant is getting serviced by the
                                same application instance.
                            </li>
                            <li>
                                Different instances of the same application, where the instances are not part of a
                                cluster for fail over or load balancing, are considered independent deployments and need
                                a Deployment License for each individual application instance.
                            </li>
                            <li>
                                Deploying an application to a cloud service (eg AWS or Docker) requires one Deployment
                                License, regardless of how many virtual containers or servers the cloud application
                                spawns for that one single instance of the application.
                            </li>
                        </ul>

                        <p>
                            If you have a deployment that doesn't fit within our licensing model, please{' '}
                            <InfoEmailLink emailSubject="AG Grid Developer license query" trackingType="deployment">
                                start a conversation with us
                            </InfoEmailLink>{' '}
                            and we will do our best to get to something that works.
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.contactSales}>
                <p className="text-secondary">
                    For any enquires about bulk pricing, questions on which license is right for you, or any other
                    license related questions please contact our friendly sales team.{' '}
                </p>

                <InfoEmailLink
                    emailSubject="AG Grid Developer license query"
                    className="font-size-extra-large"
                    trackingType="footer"
                >
                    info@ag-grid.com
                </InfoEmailLink>
            </div>
        </div>
    );
};

const LicensePricingPage = () => {
    return (
        <>
            <SEO
                title="AG Grid: License and Pricing"
                description="AG Grid is a feature-rich datagrid available in Community or Enterprise versions. This page describes the License and Pricing details for AG Grid Enterprise."
            />
            <LicensePricing />
        </>
    );
};

export default LicensePricingPage;
