
interface Props {
  // Record<string, string> diz que é um objeto com chaves e valores de texto
  styles: Record<string, string>; 
}

const Main = ({styles}: Props) => {
    return <section className={styles.main}>
        <h1>Main Content</h1>
    </section>;
  }

export default Main;