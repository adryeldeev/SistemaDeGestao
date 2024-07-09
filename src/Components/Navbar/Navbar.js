import styled from 'styled-components'

export const Perfil = styled.div`
display:flex;
flex-direction:column;
padding:20px;
width:80%;
img{
    width:90px;
}

input {
    width: 20%; /* Ajuste a largura conforme necessário */
    padding: 5px; /* Ajuste o padding conforme necessário */
    margin-bottom: 10px; /* Espaçamento inferior entre inputs */
    font-size: 14px; /* Ajuste o tamanho da fonte conforme necessário */
  }
  .nav-link{
    outline:0;
    padding-left:15px;
    font-size:25px;

}
`

export const InfoPerfil = styled.div`
display:flex;
flex-direction:column;
margin:0 auto;
`


export const InfoDash = styled.div`
display:flex;
flex-direction:column;
width:30%;

`

export const InfoButtons = styled.div`
padding:60px 0;
.accordion{
    border-top:3px solid #ccc;
    padding-top:10px;
  
}



`
