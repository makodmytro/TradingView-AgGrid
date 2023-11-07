import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import { hostPrefix } from '../utils/consts';
// @ts-ignore
import styles from './LearningVideos.module.scss';

type VideoData = {
    title: string;
    url: string;
    thumbnail: {
        image: string;
        altText: string;
    };
    keyPoints?: string[];
    runningTime: string;
};

const Video = ({ title, url, thumbnail, keyPoints, runningTime }: VideoData) => {
    return (
        <a className={styles.video} href={url} target="_blank">
            <img alt={thumbnail.altText} src={`${hostPrefix}/videos/${thumbnail.image}`} />

            <div className={styles.body}>
                <h2>
                    {title} ({runningTime})
                </h2>
                <ul>
                    {keyPoints?.map((keyPoint: string) => (
                        <li key={keyPoint}>{keyPoint}</li>
                    ))}
                </ul>
            </div>
        </a>
    );
};
const LearningVideos = ({ framework }: { framework: string }) => {
    const [videos, setVideos] = useState<{ [framework: string]: VideoData[] }>({});
    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        fetch(`${hostPrefix}/videos/videos.json`, { signal })
            .then((response) => response.json())
            .then((resultData) => setVideos(resultData))
            .catch(() => {});
        return () => controller.abort();
    }, []);

    const frameworkVideos = videos && videos[framework] && videos[framework].length > 0 ? videos[framework] : [];

    return (
        <ol className={classnames('list-style-none', styles.learningVideos)}>
            {frameworkVideos.map((video: VideoData) => {
                return (
                    <li key={video.url}>
                        <Video {...video} />
                    </li>
                );
            })}
        </ol>
    );
};

export default LearningVideos;
