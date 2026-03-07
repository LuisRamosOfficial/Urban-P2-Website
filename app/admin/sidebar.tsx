
interface Props {
  // Record<string, string> diz que é um objeto com chaves e valores de texto
  styles: Record<string, string>; 
}

const Sidebar = ({styles}: Props) => {
    return <section className={styles.sidebar}>
      <h1>Sidebar</h1>
    </section>;
  }

export default Sidebar;