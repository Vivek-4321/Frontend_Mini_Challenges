// SplitPaneWrapper.tsx
import React from 'react';
import SplitPane from './SplitPane';
import styles from './SplitPaneWrapper.module.css';

const SplitPaneWrapper: React.FC = () => {
  return (
    <div className={styles.splitPaneWrapper}>
      <SplitPane direction="horizontal" sliderPositions={[0]}>
        <div className={styles.leftPane}>
          <h2>Left Pane</h2>
          <p>This is the content of the left pane.</p>
        </div>
        <SplitPane direction="vertical" sliderPositions={[0]}>
          <div className={styles.topRightPane}>
            <h2>Top Right Pane</h2>
            <p>This is the content of the top right pane.</p>
          </div>
          <div className={styles.bottomRightPane}>
            <h2>Bottom Right Pane</h2>
            <p>This is the content of the bottom right pane.</p>
          </div>
        </SplitPane>
      </SplitPane>
    </div>
  );
};

export default SplitPaneWrapper;