import React, { useState, useEffect, Fragment } from "react";
import moment from "moment";
import { ContentDate } from "./FinanceiroStyled";
import NavItens from "../../Components/NavItens/NavItens";

const Financeiro = () => {
  const [financeData, setFinanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/financas/total-por-periodo?startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        if (response.status === 200) {
          const data = await response.json();
          setFinanceData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (e) => {
    setStartDate(moment(e.target.value).format("YYYY-MM-DD"));
  };

  const handleEndDateChange = (e) => {
    setEndDate(moment(e.target.value).format("YYYY-MM-DD"));
  };

  return (
    <Fragment>
      <NavItens />
      <h1>Financeiro</h1>
      <ContentDate>
        <div>
          <label>De:</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="dateTwo">
          <label>Até:</label>
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </div>
      </ContentDate>
      {loading ? (
        <p>Carregando...</p>
      ) : financeData.length === 0 ? (
        <p>Nenhum dado encontrado para o período selecionado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente ID</th>
              <th>Total de Serviços</th>
              <th>Total de Valor</th>
              <th>Total de Vendas</th>
            </tr>
          </thead>
          <tbody>
            {financeData.map((item) => (
              <tr key={item.data}>
                <td>{item.data}</td>
                <td>{item.clienteId}</td>
                <td>{item.totalServicos}</td>
                <td>{item.totalValor}</td>
                <td>{item.totalVendas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Fragment>
  );
};

export default Financeiro;
