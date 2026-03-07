
interface Props {
  // Record<string, string> diz que é um objeto com chaves e valores de texto
  styles: Record<string, string>; 
  label: string;
}

const Header = ({styles, label}: Props) => {
    return <section className={styles.header}>
      <h1>{label}</h1>
    </section>;
  }

export default Header;