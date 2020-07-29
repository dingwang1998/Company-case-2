import React from 'react';
import { Spin } from 'antd';
import styles from './Loading.less';



export default function Loading({ isLoading, pastDelay, error }) {
  if (isLoading && pastDelay) {
    return <div className={styles.loadingWrap}><Spin className={styles.spin} /></div>;
  } else if (error && !isLoading) {
    return <p>Error!</p>;
  } else {
    return null;
  }
}
