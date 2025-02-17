import useSWR from "swr";
import styles from "./status.module.css";

async function fetchStatus(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function UpdatedAt({ isLoading, data }) {
  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatus({ isLoading, data }) {
  let databaseStatus = <div>Carregando...</div>;

  if (!isLoading && data) {
    databaseStatus = (
      <>
        <h1 className={styles.heading}>Banco de dados</h1>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões máximas: {data.dependencies.database.max_connections}
        </div>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
      </>
    );
  }

  return databaseStatus;
}

export default function StatusPage() {
  const { isLoading, data } = useSWR("api/v1/status", fetchStatus, {
    refreshInterval: 2000,
  });
  let renderedData;

  if (isLoading) {
    renderedData = <div>Carregando...</div>;
  } else {
    renderedData = (
      <>
        <h1>Status</h1>
        <UpdatedAt data={data} {...isLoading} />
        <DatabaseStatus data={data} {...isLoading} />
      </>
    );
  }

  return <div className={styles.container}>{renderedData}</div>;
}
