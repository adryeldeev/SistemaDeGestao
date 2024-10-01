import React, { useState, useEffect, Fragment } from "react";
import moment from "moment";
import {
  ContentDate,
  TableContainer,
  StyledTable,
  StyledHeader,
  StyledCell,
  NoDataMessage,
  LoadingMessage,
} from "./FinanceiroStyled.js";
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
          `https://backendsistemasalao.onrender.com/financas/total-por-periodo?startDate=${startDate}&endDate=${endDate}`
        );
        console.log(response.status);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
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
        <LoadingMessage>Carregando...</LoadingMessage>
      ) : financeData.length === 0 ? (
        <NoDataMessage>
          Nenhum dado encontrado para o período selecionado.
        </NoDataMessage>
      ) : (
        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <StyledHeader>Total de Serviços</StyledHeader>
                <StyledHeader>Valor dos serviços</StyledHeader>
                <StyledHeader>Valor total das vendas</StyledHeader>
              </tr>
            </thead>
            <tbody>
              {financeData.map((item) => (
                <tr key={item.data}>
                  <StyledCell>{item.totalServicos}</StyledCell>
                  <StyledCell>{item.totalVendas}</StyledCell>
                  <StyledCell>{item.totalValor}</StyledCell>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}
    </Fragment>
  );
};

export default Financeiro;
