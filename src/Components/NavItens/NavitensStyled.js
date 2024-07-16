import styled from "styled-components";

export const NavbarIten = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding: 20px;
  .FaUserGear {
    font-size: 20px;
  }
  .FaPowerOff {
    font-size: 20px;
  }
  .itens {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    .iten {
      padding-left: 40px;
    }
  }
`;
