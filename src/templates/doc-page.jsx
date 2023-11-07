import classnames from 'classnames';
import { ApiDocumentation, InterfaceDocumentation } from 'components/ApiDocumentation';
import ChartGallery from 'components/chart-original-gallery/ChartGallery';
import ChartsApiExplorer from 'components/charts-api-explorer/ChartsApiExplorer';
import ExampleRunner from 'components/example-runner/ExampleRunner';
import { ExpandableSnippet } from 'components/expandable-snippet/ExpandableSnippet';
import FrameworkSpecificSection from 'components/FrameworkSpecificSection';
import Gif from 'components/Gif';
import { Icon } from 'components/Icon';
import IconsPanel from 'components/IconsPanel';
import ImageCaption from 'components/ImageCaption';
import MatrixTable from 'components/MatrixTable';
import Note from 'components/Note';
import { OpenInCTA } from 'components/OpenInCTA';
import { SEO } from 'components/SEO';
import SideMenu from 'components/SideMenu';
import { Snippet } from 'components/snippet/Snippet';
import { Tabs } from 'components/tabs/Tabs';
import VideoSection from 'components/VideoSection';
import Warning from 'components/Warning';
import { graphql } from 'gatsby';
import React, { useState } from 'react';
import rehypeReact from 'rehype-react';
import { getProductType } from 'utils/page-header';
import stripHtml from 'utils/strip-html';
import DocumentationLink from '../components/DocumentationLink';
import LearningVideos from '../components/LearningVideos';
import { trackApiDocumentation } from '../utils/analytics';
import styles from './doc-page.module.scss';

/**
 * This template is used for documentation pages, i.e. those generated from Markdown files.
 */
const DocPageTemplate = ({ data, pageContext: { framework, exampleIndexData, pageName } }) => {
    const { markdownRemark: page } = data;
    const [showSideMenu, setShowSideMenu] = useState(
        page.frontmatter.sideMenu === null ? true : page.frontmatter.sideMenu
    );

    if (!page) {
        return null;
    }

    const ast = page.htmlAst;
    // Correctly handle the 'false' string
    const parseBoolean = (value) => {
        if (!!value) {
            return value === 'true';
        }
        return undefined
    };

    const getExampleRunnerProps = (props, library) => ({
        ...props,
        // Update casing of props
        exampleImportType: props.exampleimporttype ?? undefined,
        useTypescript: parseBoolean(props.usetypescript),
        framework,
        pageName,
        library,
        exampleIndexData,
        options: props.options != null ? JSON.parse(props.options) : undefined,
    });

    // This configures which components will be used for the specified HTML tags
    const renderAst = new rehypeReact({
        createElement: React.createElement,
        components: {
            a: (props) => DocumentationLink({ ...props, framework }),
            gif: (props) =>
                Gif({ ...props, pageName, autoPlay: props.autoPlay != null ? JSON.parse(props.autoPlay) : false }),
            'grid-example': (props) => <ExampleRunner {...getExampleRunnerProps(props, 'grid')} />,
            'chart-example': (props) => <ExampleRunner {...getExampleRunnerProps(props, 'charts')} />,
            'api-documentation': (props) =>
                ApiDocumentation({
                    ...props,
                    pageName,
                    framework,
                    exampleIndexData,
                    sources: props.sources != null ? JSON.parse(props.sources) : undefined,
                    config: props.config != null ? JSON.parse(props.config) : undefined,
                }),
            'interface-documentation': (props) =>
                InterfaceDocumentation({
                    ...props,
                    framework,
                    exampleIndexData,
                    config: props.config != null ? JSON.parse(props.config) : undefined,
                }),
            snippet: (props) =>
                Snippet({
                    ...props,
                    // NOTE: lowercased upstream
                    lineNumbers: props.linenumbers === 'true',
                    framework,
                }),
            'expandable-snippet': (props) =>
                ExpandableSnippet({
                    ...props,
                    framework,
                    exampleIndexData,
                    breadcrumbs: props.breadcrumbs ? JSON.parse(props.breadcrumbs) : undefined,
                    config: props.config != null ? JSON.parse(props.config) : undefined,
                }),
            'icons-panel': (props) => <IconsPanel {...props} />,
            'image-caption': (props) => ImageCaption({ ...props, pageName }),
            'matrix-table': (props) => MatrixTable({ ...props, framework, exampleIndexData }),
            tabs: (props) => Tabs({ ...props }),
            'learning-videos': (props) => LearningVideos({ framework }),
            'video-section': VideoSection,
            note: (props) =>
                Note({
                    ...props,
                    // NOTE: lowercased upstream
                    disableMarkdown: props['disablemarkdown'],
                }),
            warning: Warning,
            'framework-specific-section': (props) =>
                FrameworkSpecificSection({ ...props, currentFramework: framework }),
            'chart-gallery': (props) => <ChartGallery {...props} />,
            'charts-api-explorer': (props) => (
                <ChartsApiExplorer {...props} framework={framework} exampleIndexData={exampleIndexData} />
            ),
            'open-in-cta': OpenInCTA,
            pre: ({ children, className, ...otherProps }) => (
                <pre className={classnames('code', className)} {...otherProps}>
                    {children}
                </pre>
            ),
        },
    }).Compiler;

    let { title, description, version } = page.frontmatter;

    version = version ? ` ${version}` : '';

    if (!description) {
        // If no description is provided in the Markdown, we create one from the lead paragraph
        const firstParagraphNode = ast.children.filter((child) => child.tagName === 'p')[0];

        if (firstParagraphNode) {
            description = stripHtml(firstParagraphNode);
        }
    }

    // solidjs is still tactical and "lives" under react - make a bit of an exception here so the title makes sense
    const pageTitle = (
        <>
            {pageName === 'solidjs' ? (
                <span className={styles.headerFramework}>SolidJS Data Grid:</span>
            ) : (
                <span className={styles.headerFramework}>
                    {getProductType(framework, pageName.startsWith('charts-'), version)}
                </span>
            )}
            <span>{title}</span>
        </>
    );

    return (
        <div id="doc-page-wrapper" className={styles['doc-page-wrapper']}>
            <div id="doc-content" className={classnames(styles['doc-page'], { [styles.noSideMenu]: !showSideMenu })}>
                {/*eslint-disable-next-line react/jsx-pascal-case*/}
                <SEO title={title} description={description} framework={framework} pageName={pageName} />

                <header className={styles.docsPageHeader}>
                    <h1 id="top" className={styles.docsPageTitle}>
                        {pageTitle}
                        {page.frontmatter.enterprise && (
                            <span className={styles.enterpriseLabel}>
                                Enterprise
                                <Icon name="enterprise" />
                            </span>
                        )}
                    </h1>
                </header>

                {/* Wrapping div is a hack to target "intro" section of docs page */}
                <div className={styles.pageSections}>{renderAst(ast)}</div>
            </div>

            {showSideMenu && (
                <SideMenu
                    headings={page.headings || []}
                    pageName={pageName}
                    pageTitle={title}
                    hideMenu={() => setShowSideMenu(false)}
                    tracking={(args) => {
                        trackApiDocumentation({
                            ...args,
                            framework,
                        });
                    }}
                />
            )}
        </div>
    );
};

export const pageQuery = graphql`
    query DocPageByPath($srcPath: String!) {
        markdownRemark(fields: { path: { eq: $srcPath } }) {
            htmlAst
            frontmatter {
                title
                version
                enterprise
                sideMenu
                description
            }
            headings {
                id
                depth
                value
            }
        }
    }
`;

export default DocPageTemplate;
