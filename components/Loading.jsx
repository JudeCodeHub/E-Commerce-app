'use client'
import styles from './Loading.module.css'

const Loading = ({ fullScreen = true }) => {

    return (
        <div className={`flex items-center justify-center ${fullScreen ? 'h-screen' : 'py-20'}`}>
            <div className={styles.wifiLoader}>
                <svg viewBox='0 0 86 86' className={styles.circleOuter}>
                    <circle r='40' cy='43' cx='43' className={styles.back}></circle>
                    <circle r='40' cy='43' cx='43' className={styles.front}></circle>
                </svg>
                <svg viewBox='0 0 60 60' className={styles.circleMiddle}>
                    <circle r='27' cy='30' cx='30' className={styles.back}></circle>
                    <circle r='27' cy='30' cx='30' className={styles.front}></circle>
                </svg>
                <div data-text='Loading...' className={styles.text}></div>
            </div>
        </div>
    )
}

export default Loading
