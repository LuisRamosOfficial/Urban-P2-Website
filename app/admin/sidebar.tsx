import 'material-icons/iconfont/filled.css';

interface Props {
  // Record<string, string> diz que é um objeto com chaves e valores de texto
  styles: Record<string, string>; 
  state: string;
  setState: (valor: string) => void;
}

const Sidebar = ({styles, state, setState}: Props) => {
    return <section className={styles.sidebar}>
      <h3>SIDEBAR</h3>
      <div className={state === "posts" ? styles.button + " " + ` ${styles.button} ${styles.active}` : styles.button} onClick={() => setState && setState("posts")}>
        <span className="material-icons">post_add</span>Posts
      </div>
      <div className={state === "users" ? styles.button + " " + ` ${styles.button} ${styles.active}` : styles.button} onClick={() => setState && setState("users")}>
        <span className="material-icons">person</span>Users
      </div>
      <div className={state === "settings" ? styles.button + " " + ` ${styles.button} ${styles.active}` : styles.button} onClick={() => setState && setState("settings")}>
        <span className="material-icons">settings</span>Settings
      </div>
    </section>;
  }

export default Sidebar;