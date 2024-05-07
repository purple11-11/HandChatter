import spinner from "../../assets/hourglass.gif";
import styles from "./spinner.module.scss";

export default function Spinner() {
    return (
        <section className={`${styles.spinner}`}>
            <img src={spinner} alt="loading" />
            <p>Loading . . .</p>
        </section>
    );
}
