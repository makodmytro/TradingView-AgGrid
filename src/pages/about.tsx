import React from 'react';
import styles from './about.module.scss';
import SEO from './components/SEO';

const AboutPage = () => {
    return (
        <>
            <SEO
                title="Our Mission, Our Principles and Our Team at AG Grid"
                description="AG Grid is a feature-rich datagrid available in Community or Enterprise versions. This is the story of AG Grid and explains our mission, where we came from and who we are."
            />
            <div className={styles.aboutPage}>
                <div className="page-margin">
                    <section>
                        <h1>About AG Grid</h1>
                    </section>

                    <section>

                        <article>
                            <br/>
                            <p>
                                Born out of frustration with existing solutions, <strong>AG Grid</strong> evolved from a
                                side project to becoming the leading JavaScript datagrid on the market. We are a company
                                built by developers for developers, and - true to our roots - we offer{' '}
                                <strong>AG Grid Community</strong>: a free and open-source project that delivers world
                                class grid performance. <strong>AG Grid Enterprise</strong> is our commercially-licensed
                                offering which has enjoyed widespread adoption and facilitates us to keep delivering on
                                our mission.
                            </p>
                            <p>
                                Today, <strong>AG Grid</strong> is a self-funded, bootstrapped company with thousands of
                                customers globally. Even though we've already created the world's best Javascript datagrid,
                                our work isn't over: we're forging ahead with the development of new features to show the
                                world what’s possible in a Javascript datagrid.
                            </p>
                        </article>
                    </section>

                    <section>
                        <h2>Our Principles</h2>

                        <article>
                            <p>
                                We believe that a datagrid should be framework-agnostic, providing developers with flexibility
                                and future-proofing their work. This philosophy is mirrored in our name; ‘AG' stands for agnostic.

                                Our experience is in building Enterprise applications: we know that the datagrid is at
                                the core of an Enterprise application, and needs to deliver performance and a rich
                                feature set.

                                We pride ourselves on offering what others typically charge for. <strong>AG Grid
                                Community</strong> delivers features comparable to our competition, free of charge.
                            </p>
                        </article>
                    </section>

                    <section>
                        <h2>The Dev Team</h2>

                        <article className={styles.team}>
                            <div>
                                <img src="../images/team/niall.jpg" alt="Niall Crosby, CEO / Founder" />
                                <h3>Niall Crosby</h3>
                                <p>CEO / Founder</p>
                            </div>
                            <div>
                                <img src="../images/team/rob.jpg" alt="Rob Clarke, VP Engineering" />
                                <h3>Rob Clarke</h3>
                                <p>CTO</p>
                            </div>
                            <div>
                                <img src="../images/team/sean.jpg" alt="Sean Landsman, Lead Developer" />
                                <h3>Sean Landsman</h3>
                                <p>Lead Developer, Frameworks</p>
                            </div>
                            <div>
                                <img src="../images/team/gil.jpg" alt="Guilherme Lopes, Lead Developer" />
                                <h3>Guilherme Lopes</h3>
                                <p>Lead Developer, UI</p>
                            </div>
                            <div>
                                <img src="../images/team/stephen.jpeg" alt="Stephen Cooper, Developer" />
                                <h3>Stephen Cooper</h3>
                                <p>Developer, Grid Core</p>
                            </div>
                            <div>
                                <img src="../images/team/andy.jpg" alt="Andrew Glazier, Developer" />
                                <h3>Andrew Glazier</h3>
                                <p>Developer, Grid Core</p>
                            </div>
                            <div>
                                <img src="../images/team/tak.png" alt="Tak Tran, Developer" />
                                <h3>Tak Tran</h3>
                                <p>Developer, Grid Core</p>
                            </div>
                            <div>
                                <img src="../images/team/peter.jpg" alt="Peter Reynolds, Developer" />
                                <h3>Peter Reynolds</h3>
                                <p>Developer, Grid Core</p>
                            </div>
                            <div>
                                <img src="../images/team/alanT.jpg" alt="Alan Treadway, Developer" />
                                <h3>Alan Treadway</h3>
                                <p>Lead Developer, Data Visualisation</p>
                            </div>
                            <div>
                                <img src="../images/team/mana.jpeg" alt="Mana Peirov, Developer" />
                                <h3>Mana Peirov</h3>
                                <p>Developer, Data Visualisation</p>
                            </div>
                            <div>
                                <img src="../images/team/alex.png" alt="Alex Shutau, Developer" />
                                <h3>Alex Shutau</h3>
                                <p>Developer, Data Visualisation</p>
                            </div>
                            <div>
                                <img
                                    src="../images/team/alberto.jpg"
                                    alt="Alberto Gutierrez, Head of Customer Services"
                                />
                                <h3>Alberto Gutierrez</h3>
                                <p>Head of Customer Services</p>
                            </div>
                            <div>
                                <img src="../images/team/kiril.png" alt="Kiril Matev, Technical Product Manager" />
                                <h3>Kiril Matev</h3>
                                <p>Technical Product Manager</p>
                            </div>
                            <div>
                                <img src="../images/team/david.jpg" alt="David Glickman, Technical Product Analyst" />
                                <h3>David Glickman</h3>
                                <p>Technical Product Analyst</p>
                            </div>
                            <div>
                                <img src="../images/team/zoheil.jpg" alt="Zoheil Khaleqi, Technical Product Analyst" />
                                <h3>Zoheil Khaleqi</h3>
                                <p>Technical Product Analyst</p>
                            </div>
                            <div>
                                <img src="../images/team/viqas.jpg" alt="Viqas Hussain, Lead Developer" />
                                <h3>Viqas Hussain</h3>
                                <p>Lead Developer, E-commerce</p>
                            </div>
                            <div>
                                <img src="../images/team/mark.jpg" alt="Mark Durrant, Lead UX Designer" />
                                <h3>Mark Durrant</h3>
                                <p>Lead UX Designer</p>
                            </div>
                        </article>
                    </section>

                    <section>
                        <h2>The Operations Team</h2>

                        <article className={styles.team}>
                            <div>
                                <img src="../images/team/dimo.jpg" alt="Dimo Iliev, Managing Director" />
                                <h3>Dimo Iliev</h3>
                                <p>Managing Director</p>
                            </div>
                            <div>
                                <img src="../images/team/simon.jpg" alt="Simon Kenny, Customer Experience Manager" />
                                <h3>Simon Kenny</h3>
                                <p>Sales Director</p>
                            </div>
                            <div>
                                <img src="../images/team/nathan.jpeg" alt="Nathan Gauge-Klein, General Counsel" />
                                <h3>Nathan Gauge-Klein</h3>
                                <p>General Counsel</p>
                            </div>
                            <div>
                                <img
                                    src="../images/team/victoria.jpeg"
                                    alt="Victoria Tennant, Business Development Manager"
                                />
                                <h3>Victoria Tennant</h3>
                                <p>Renewals Team Manager</p>
                            </div>
                            <div>
                                <img src="../images/team/dimple.jpg" alt="Dimple Unalkat, Customer Experience Team" />
                                <h3>Dimple Unalkat</h3>
                                <p>Initials Team Manager</p>
                            </div>
                            <div>
                                <img
                                    src="../images/team/sachshell.png"
                                    alt="Sachshell Rhoden, Customer Experience Manager"
                                />
                                <h3>Sachshell Rhoden</h3>
                                <p>Sales Operations Manager</p>
                            </div>
                            <div>
                                <img
                                    src="../images/team/alison.jpeg"
                                    alt="Alison Bunworth, Business Development Manager"
                                />
                                <h3>Alison Bunworth</h3>
                                <p>Business Development Manager</p>
                            </div>
                            <div>
                                <img src="../images/team/robD.jpg" alt="Rob Dunkiert, Customer Experience Manager" />
                                <h3>Rob Dunkiert</h3>
                                <p>Customer Experience Manager</p>
                            </div>
                            <div>
                                <img
                                    src="../images/team/seweety.jpeg"
                                    alt="Seweety Kumar, Customer Experience Manager"
                                />
                                <h3>Seweety Kumar</h3>
                                <p>Customer Experience Manager</p>
                            </div>
                            <div>
                                <img src="../images/team/laiyan.jpeg" alt="Laiyan Woo, Customer Experience Manager" />
                                <h3>Laiyan Woo</h3>
                                <p>Customer Experience Manager</p>
                            </div>
                            <div>
                                <img src="../images/team/amir.jpeg" alt="Amir Hussain, Customer Experience Manager" />
                                <h3>Amir Hussain</h3>
                                <p>Customer Experience Manager</p>
                            </div>
                            <div>
                                <img
                                    src="../images/team/jordan.jpeg"
                                    alt="Jordan Shekoni, Customer Experience Manager"
                                />
                                <h3>Jordan Shekoni</h3>
                                <p>Customer Experience Manager</p>
                            </div>
                            <div>
                                <img src="../images/team/tobi.jpg" alt="Tobi Aguda, Customer Experience Manager" />
                                <h3>Tobi Aguda</h3>
                                <p>Customer Experience Manager</p>
                            </div>
                            <div>
                                <img src="../images/team/kylie.jpg" alt="Kylie Slevin, Customer Experience Manager" />
                                <h3>Kylie Slevin</h3>
                                <p>Customer Experience Manager</p>
                            </div>
                            <div>
                                <img
                                    src="../images/team/kathryn.png"
                                    alt="Kathryn Knapman, Customer Experience Manager"
                                />
                                <h3>Kathryn Knapman</h3>
                                <p>PA to CEO and Office Manager</p>
                            </div>
                        </article>
                    </section>

                    <section>
                        <h2>Contact Us</h2>

                        <article className={styles.footer}>
                            <div>
                                <h3>Our Address</h3>
                                <address>
                                    <strong>AG Grid Ltd.</strong>
                                    <br />
                                    Bank Chambers
                                    <br />
                                    6 Borough High Street
                                    <br />
                                    London
                                    <br />
                                    SE1 9QQ
                                    <br />
                                    United Kingdom
                                </address>
                                <p>
                                    Email Enquiries: <a href="mailto:info@ag-grid.com">info@ag-grid.com</a>
                                </p>
                            </div>
                        </article>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AboutPage;
