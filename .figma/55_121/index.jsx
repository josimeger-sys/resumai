import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.styleSnapAiGeneratio}>
      <div className={styles.container6}>
        <div className={styles.container2}>
          <div className={styles.background}>
            <img src="../image/mlp3h825-d9xc0pb.svg" className={styles.container} />
          </div>
          <div className={styles.paragraph}>
            <p className={styles.text}>StyleSnap AI&nbsp;</p>
            <p className={styles.text2}>闪绘 AI</p>
          </div>
        </div>
        <div className={styles.container5}>
          <div className={styles.link}>
            <img
              src="../image/mlp3h825-ks51q6z.svg"
              className={styles.container3}
            />
            <p className={styles.text3}>Gallery</p>
          </div>
          <div className={styles.verticalDivider} />
          <div className={styles.overlay}>
            <img
              src="../image/mlp3h825-owc2i03.svg"
              className={styles.container4}
            />
            <p className={styles.text4}>12 Credits Left</p>
          </div>
          <div className={styles.overlayBorder}>
            <img src="../image/mlp3h827-3et1oxs.png" className={styles.profile} />
          </div>
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.statusHeader}>
          <p className={styles.text5}>Artistic Masterpiece Ready</p>
          <div className={styles.container7}>
            <p className={styles.text8}>
              <span className={styles.text6}>Processed using&nbsp;</span>
              <span className={styles.text7}>Cyberpunk v2 Engine</span>
              <span className={styles.text6}>&nbsp;in 4.2s</span>
            </p>
          </div>
        </div>
        <div className={styles.resultContainer}>
          <div className={styles.resultContainerShado}>
            <div className={styles.mainCanvasComparison}>
              <div className={styles.stylizedResult}>
                <div className={styles.autoWrapper}>
                  <div className={styles.beforeImageOriginalC}>
                    <div className={styles.originalImage}>
                      <div className={styles.comparisonUiElements}>
                        <p className={styles.text9}>Original</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.background2}>
                    <div className={styles.overlayShadow}>
                      <img
                        src="../image/mlp3h825-z5z2um2.svg"
                        className={styles.container8}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.overlayOverlayBlur}>
                  <p className={styles.text10}>Stylized</p>
                </div>
              </div>
            </div>
            <div className={styles.actionToolbar}>
              <div className={styles.container11}>
                <div className={styles.button}>
                  <div className={styles.buttonShadow}>
                    <img
                      src="../image/mlp3h825-16losmf.svg"
                      className={styles.container9}
                    />
                    <p className={styles.text11}>Download 4K Image</p>
                  </div>
                </div>
                <div className={styles.button2}>
                  <img
                    src="../image/mlp3h825-crlzscw.svg"
                    className={styles.container10}
                  />
                  <p className={styles.text12}>Save to Album</p>
                </div>
              </div>
              <div className={styles.container14}>
                <div className={styles.button3}>
                  <img
                    src="../image/mlp3h825-ppevtml.svg"
                    className={styles.container12}
                  />
                  <p className={styles.text13}>Try Another</p>
                </div>
                <div className={styles.button4}>
                  <img
                    src="../image/mlp3h825-1wriyuk.svg"
                    className={styles.container13}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.metadataFeedback}>
          <div className={styles.backgroundBorder}>
            <div className={styles.container16}>
              <img
                src="../image/mlp3h825-7cky4ag.svg"
                className={styles.container15}
              />
              <p className={styles.text14}>Style Details</p>
            </div>
            <div className={styles.container17}>
              <p className={styles.text15}>
                Style: Cyberpunk v2
                <br />
                Resolution: 3840 x 2160
                <br />
                Engine: GPT-4o Vision Enhancer
              </p>
            </div>
          </div>
          <div className={styles.backgroundBorder2}>
            <div className={styles.container19}>
              <img
                src="../image/mlp3h825-1fja7kw.svg"
                className={styles.container18}
              />
              <p className={styles.text16}>Quick Tip</p>
            </div>
            <div className={styles.container20}>
              <p className={styles.text17}>
                Try the "Studio Light" style next for
                <br />
                better portrait results with similar color
                <br />
                tones.
              </p>
            </div>
          </div>
          <div className={styles.backgroundBorder3}>
            <div className={styles.container22}>
              <img
                src="../image/mlp3h825-7lexewk.svg"
                className={styles.container21}
              />
              <p className={styles.text18}>Quality check</p>
            </div>
            <div className={styles.container23}>
              <div className={styles.button5}>
                <p className={styles.text19}>Love it</p>
              </div>
              <div className={styles.button6}>
                <p className={styles.text20}>Needs work</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerMargin}>
        <div className={styles.container25}>
          <p className={styles.text21}>
            © 2024 StyleSnap AI. All creative rights reserved.
          </p>
          <div className={styles.container24}>
            <p className={styles.text22}>Privacy Policy</p>
            <p className={styles.text23}>Terms of Service</p>
            <p className={styles.text24}>Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
