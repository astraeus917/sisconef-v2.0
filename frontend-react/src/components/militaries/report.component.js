import server_ip from '../config';
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from 'axios'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Form, Button } from 'react-bootstrap';

export default function Report() {
    const navigate = useNavigate();

    useEffect(() => { // Verifique se o usuário tem permissão de administrador
        const userRole = localStorage.getItem('user_role');
        const allowedRoles = ['Admin', 'Brigada', 'Sgte', 'Visitor'];
        if (!userRole || !allowedRoles.includes(userRole)) {
            navigate("/"); // Redirecione para a página inicial ou outra página de acesso negado.
        }
    }, [navigate]); // Este array vazio garante que o efeito seja executado apenas uma vez após a montagem inicial do componente.

    return (
        <ReportContent navigate={navigate} />
    );
}

function ReportContent({ navigate }) {
    const [subunits, setSubunits] = useState([])
    const [destinations, setDestinations] = useState([])
    const [workplaces, setWorkplaces] = useState([])
    const [militaries, setMilitaries] = useState([])
    const [allMilitaries, setAllMilitaries] = useState([])
    const [selectedSubunits, setSelectedSubunits] = useState([])
    const [selectedDestinations, setSelectedDestinations] = useState([])
    const [otherDestinations, setOtherDestinations] = useState([])
    const [selectedWorkplaces, setSelectedWorkplaces] = useState([])
    const [filteredMilitaries, setFilteredMilitaries] = useState([])
    const [filteredMilitariesDate, setFilteredMilitariesDate] = useState([])
    const [date, setDate] = useState(formatDate(new Date()));
    const [search, setSearch] = useState("");

    async function fetchSubunitData() {
        try {
            const { data } = await axios.get(`${server_ip}/api/subunits/`);
            const results = data.map(value => ({
                key: value.name,
                value: value.id,
            }));
            setSubunits(results);
        } catch (error) {
            console.error("Erro ao buscar dados das subunidades:", error);
        }
    }

    useEffect(() => {
        fetchAllMilitaries();
        fetchMilitaries();
        fetchSubunitData();
        fetchDestinations();
        fetchWorkplaces();
        fetchMilitariesDate();
    }, [])

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }


    // const fetchDestinations = async () => { // Busca dos destinos no banco de dados.
    //     try {
    //         const { data } = await axios.get(`${server_ip}/api/destinations`);
    //         const results = data.map(value => ({
    //             key: value.destination,
    //             value: value.id,
    //         }));
    //         setDestinations(results);
    //     } catch (error) {
    //         console.error("Erro ao buscar dados dos destinos:", error);
    //     }
    // }

    const fetchDestinations = async () => {
        // Lista de destinos a serem excluídos do filtro adicional.
        const excludedDestinations = ['PRONTO', 'FÉRIAS', 'DISP MED', 'DISP REC', 'SSV', 'SERVIÇO'];
    
        try {
            const { data } = await axios.get(`${server_ip}/api/destinations`);
    
            // Mapeia os dados retornados para o formato desejado.
            const results = data.map(value => ({
                key: value.destination,
                value: value.id,
            }));
    
            // Define todos os destinos encontrados.
            setDestinations(results);
    
            // Filtra destinos, removendo os que estão na lista de exclusão.
            const filteredResults = results.filter(destination => !excludedDestinations.includes(destination.key));
            // Define os destinos filtrados.
            setOtherDestinations(filteredResults);
        } catch (error) {
            console.error("Erro ao buscar dados dos destinos:", error);
        }
    };

    const fetchWorkplaces = async () => { // Busca as seções/funções no banco de dados.
        try {
            const { data } = await axios.get(`${server_ip}/api/workplaces`);
            const results = data.map(value => ({
                key: value.workplace,
                value: value.id,
            }));
            setWorkplaces(results);
        } catch (error) {
            console.error("Erro ao buscar dados dos workplaces:", error);
        }
    }

    const fetchMilitariesDate = () => { // Busca dos destinos no banco de dados.
        try {
            axios.post(`${server_ip}/api/presence-made/total-militaries`, { date: date }).then(({ data }) => {
                setFilteredMilitariesDate(data);
            });
        } catch (error) {
            console.error('Erro ao buscar militares data:', error);
        }
    };

    const fetchMilitaries = async () => { // Busca dos destinos no banco de dados.
        try {
            const { data } = await axios.post(`${server_ip}/api/presence-made/total-militaries`);
            setMilitaries(data);
            setFilteredMilitaries(data);
        } catch (error) {
            console.error('Erro ao buscar militares:', error);
        }
    };

    const fetchAllMilitaries = async () => { // Busca dos destinos no banco de dados.
        try {
            await axios.post(`${server_ip}/api/militaries/list`, { subunit_id: 1 }).then(({ data }) => {
                setAllMilitaries(data);
            })
        } catch (error) {
            console.error('Erro ao buscar militares:', error);
        }
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedSubunits([...selectedSubunits, value]);
            console.log('Subunits selecionadas:', selectedSubunits);
        } else {
            setSelectedSubunits(selectedSubunits.filter((item) => item !== value));
            console.log('Subunits selecionadas:', selectedSubunits);
        }
    };

    const handleCheckboxAllSubunits = (event) => {
        let selecteds = [];
        const { value, checked } = event.target;
        if (checked) {
            document.querySelectorAll('input[name=subunits]').forEach((el) => {
                el.checked = true;
                selecteds.push(el.value); 
                console.log(selecteds);       
            });
            
        } else {
            document.querySelectorAll('input[name=subunits]').forEach(el => el.checked = false);
            selecteds = [];
        }

        setSelectedSubunits(selecteds);

        console.log('Subunits selecionadas:', selectedSubunits);
    };

    const handleCheckboxChangeDestination = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedDestinations([...selectedDestinations, value]);
        } else {
            setSelectedDestinations(selectedDestinations.filter((item) => item !== value));
        }

        console.log('Subunits selecionadas:', selectedDestinations);
    };

    const handleCheckboxAllDestinations = (event) => {
        let selecteds = [];
        const { value, checked } = event.target;
        if (checked) {
            document.querySelectorAll('input[name=destination]').forEach((el) => {
                el.checked = true;
                selecteds.push(el.value); 
                console.log(selecteds);       
            });
            
        } else {
            document.querySelectorAll('input[name=destination]').forEach(el => el.checked = false);
            selecteds = [];
        }

        setSelectedDestinations(selecteds);

        console.log('Subunits selecionadas:', selectedDestinations);
    };

    const handleCheckboxChangeWorkplace = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedWorkplaces([...selectedWorkplaces, value]);
        } else {
            setSelectedWorkplaces(selectedWorkplaces.filter((item) => item !== value));
        }

        console.log('selectedWorkplaces selecionadas:', selectedWorkplaces);
    };

    const handleCheckboxAllWorkplaces = (event) => {
        let selecteds = [];
        const { value, checked } = event.target;
        if (checked) {
            document.querySelectorAll('input[name=workplace]').forEach((el) => {
                el.checked = true;
                selecteds.push(el.value); 
                console.log(selecteds);       
            });
            
        } else {
            document.querySelectorAll('input[name=workplace]').forEach(el => el.checked = false);
            selecteds = [];
        }

        setSelectedWorkplaces(selecteds);

        console.log('Subunits selecionadas:', selectedWorkplaces);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
            var filtered = filteredMilitariesDate;    

        var filtered = filteredMilitariesDate;

        if (selectedSubunits.length > 0 || selectedDestinations.length > 0 || selectedWorkplaces.length > 0 || search != "") {

            if (search != "") {
                filtered = filtered.filter(military => military.name.toLowerCase().includes(search.toLowerCase()));
            }

            if (selectedSubunits.length > 0) {
                filtered = filtered.filter(military => selectedSubunits.includes(military.subunit_id.toString()));
            }
            if (selectedDestinations.length > 0) {
                filtered = filtered.filter(military => selectedDestinations.includes(military.destination_id.toString()));
            }
            if (selectedWorkplaces.length > 0) {
                filtered = filtered.filter(military => selectedWorkplaces.includes(military.workplace_id.toString()));
            }
            setFilteredMilitaries([...filtered]);
        } else {
            setFilteredMilitaries([...filtered]); // Exibir todos se nenhum checkbox estiver marcado
        }

        (function (){
            document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
            setSelectedSubunits([]);
            setSelectedDestinations([]);
            setSelectedWorkplaces([]);
        })();
    };

    const generatePDF = async () => { // Gerar relatorio em PDF.
        // const list = ['ADIDO', 'AGREGADO', 'DISP MED', 'DISPENSA', 'DISP REC', 'EST CURSO', 'FALTA', 'FÉRIAS', 'INSTALAÇÃO', 'LIBERAÇÃO TEMP', 'LIC PATER', 'MISSÃO', 'RESIDÊNCIA', 'SFPC', 'VIAGEM']; // Lista de destinos para o filtro.

        console.log('Miitares Fitrados:', filteredMilitaries);

        if (filteredMilitaries.length === 0) {
            Swal.fire({
                title: 'Gerar Relatório',
                text: 'Nenhuma presença foi encontrada no Banco de Dados.',
                icon: "error",
                showConfirmButton: false,
                timer: 3500
            })
            return;
        }

        const doc = new jsPDF();
        let now = new Date(); 

        // Título do relatório.
        const titleFontSize = 12;
        doc.setFontSize(titleFontSize);
        const titleText = `Relatório do Mapa da Força do dia ${date}, gerado no dia ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} às ${ now.getHours()}:${now.getMinutes()}`;
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getTextWidth(titleText);
        const textX = (pageWidth - textWidth) / 2;
        doc.text(titleText, textX, 22);

        // Cria a tabela dos dados.
        const headers = [['PDG', 'Nº', 'Nome', 'Destino', 'SU']];
        const rows = filteredMilitaries.map(military => [military.rankName, military.number, military.name, military.destination, military.subunitName]);

        doc.autoTable({
            head: headers,
            body: rows,
            startY: 30,
            margin: { top: 10, left: 14, right: 14, bottom: 10 },
            theme: 'grid'
        });

        const predefinedRanks = {
            'Cel': 0,
            'TC': allMilitaries.filter(military =>  military.rankName == 'TC').length,
            'Maj': allMilitaries.filter(military =>  military.rankName == 'Maj').length,
            'Cap PTTC': allMilitaries.filter(military =>  military.rankName == 'Cap PTTC').length,
            'Cap': allMilitaries.filter(military =>  military.rankName == 'Cap').length,
            '1º Ten': allMilitaries.filter(military =>  military.rankName == '1º Ten').length,
            '2º Ten': allMilitaries.filter(military =>  military.rankName == '2º Ten').length,
            '2º Ten Reint': allMilitaries.filter(military =>  military.rankName == '2º Ten Reint').length,
            'Asp Of': allMilitaries.filter(military =>  military.rankName == 'Asp Of').length,
            'ST': allMilitaries.filter(military =>  military.rankName == 'ST').length,
            '1º Sgt': allMilitaries.filter(military =>  military.rankName == '1º Sgt').length,
            '2º Sgt': allMilitaries.filter(military =>  military.rankName == '2º Sgt').length,
            '3º Sgt': allMilitaries.filter(military =>  military.rankName == '3º Sgt').length,
            '3º Sgt Reint': allMilitaries.filter(military =>  military.rankName == '3º Sgt Reint').length,
            'Cb':  allMilitaries.filter(military =>  military.rankName == 'Cb').length,
            'Cb Reint':  allMilitaries.filter(military =>  military.rankName == 'Cb Reint').length,
            'Cb EV':  allMilitaries.filter(military =>  military.rankName == 'Cb EV').length,
            'Sd EP':  allMilitaries.filter(military =>  military.rankName == 'Sd EP').length,
            'Sd EP Reint':  allMilitaries.filter(military =>  military.rankName == 'Sd EP Reint').length,
            'Sd EV':  allMilitaries.filter(military =>  military.rankName == 'Sd EV').length,
            'Sd Adido':  allMilitaries.filter(military =>  military.rankName == 'Sd Adido').length,
        };

        const destinations = ['PRONTO', 'FÉRIAS', 'DISP MED', 'DISP REC', 'SSV', 'SERVIÇO'];
        // const otherDestinations = ['ADIDO', 'AGREGADO', 'DISPENSA', 'EST CURSO', 'FALTA', 'INSTALAÇÃO', 'LIBERAÇÃO TEMP', 'LIC PATER', 'MISSÃO', 'SFPC', 'VIAGEM', 'NÚPCIAS', 'DISP DISC FÉRIAS', 'PRESO', 'LUTO', 'CS', 'REINT JUD'];

        // Inicializar a estrutura de contagem por destinos para cada graduação.
        const rankMap = {};
        Object.keys(predefinedRanks).forEach(rank => {
            rankMap[rank] = {
                total: predefinedRanks[rank],
                total_em: allMilitaries.filter(military => (military.rankName == rank && military.subunit_id == '1')).length,
                total_bc: allMilitaries.filter(military => (military.rankName == rank && military.subunit_id == '2')).length,
                total_1: allMilitaries.filter(military => (military.rankName == rank && military.subunit_id == '3')).length,
                total_2: allMilitaries.filter(military => (military.rankName == rank && military.subunit_id == '4')).length,
                total_3: allMilitaries.filter(military => (military.rankName == rank && military.subunit_id == '5')).length,
                pronto: 0,
                ferias: 0,
                dispMed: 0,
                dispRec: 0,
                outros: 0
            };
        });

        // Contar a quantidade de militares por destino para cada graduação.
        filteredMilitaries.forEach(military => {
            const rankName = military.rankName;
            const destination = military.destination;

            if (rankMap[rankName]) {
                if (destination === 'PRONTO' || destination === 'SSV' || destination === 'SERVIÇO' ) {
                    rankMap[rankName].pronto++;
                } else if (destination === 'FÉRIAS') {
                    rankMap[rankName].ferias++;
                } else if (destination === 'DISP MED') {
                    rankMap[rankName].dispMed++;
                } else if (destination === 'DISP REC') {
                    rankMap[rankName].dispRec++;
                } else if (otherDestinations.some(d => d.key === destination)) {
                    rankMap[rankName].outros++;
                }
            }
        });

        // Calcular os totais de cada coluna.
        const total = {
            total: 0,
            total_em: 0,
            total_bc: 0,
            total_1: 0,
            total_2: 0,
            total_3: 0,
            pronto: 0,
            ferias: 0,
            dispMed: 0,
            dispRec: 0,
            outros: 0
        };
        Object.keys(rankMap).forEach(rank => {
            total.total += rankMap[rank].total;
            total.total_em += rankMap[rank].total_em;
            total.total_bc += rankMap[rank].total_bc;
            total.total_1 += rankMap[rank].total_1;
            total.total_2 += rankMap[rank].total_2;
            total.total_3 += rankMap[rank].total_3;
            total.pronto += rankMap[rank].pronto;
            total.ferias += rankMap[rank].ferias;
            total.dispMed += rankMap[rank].dispMed;
            total.dispRec += rankMap[rank].dispRec;
            total.outros += rankMap[rank].outros;
        });


        // Título do relatório
        doc.setFontSize(titleFontSize);

        // Cria a tabela dos dados
        const headersQtd = [['PDG', 'QTD', 'EM', 'BC', '1ª BO', '2ª BO', '3ª BO','PRONTO', 'FÉRIAS', 'DISP MED', 'DISP REC', 'OUTROS']];
        const rowsQtd = Object.keys(rankMap).map(rankName => [
            rankName,
            rankMap[rankName].total,
            rankMap[rankName].total_em,
            rankMap[rankName].total_bc,
            rankMap[rankName].total_1,
            rankMap[rankName].total_2,
            rankMap[rankName].total_3,
            rankMap[rankName].pronto,
            rankMap[rankName].ferias,
            rankMap[rankName].dispMed,
            rankMap[rankName].dispRec,
            rankMap[rankName].outros
        ]);

        // Adiciona a linha de total.
        rowsQtd.push([
            'TOTAL',
            total.total,
            total.total_em,
            total.total_bc,
            total.total_1,
            total.total_2,
            total.total_3,
            total.pronto,
            total.ferias,
            total.dispMed,
            total.dispRec,
            total.outros
        ]);

        doc.insertPage();

        doc.autoTable({
            head: headersQtd,
            body: rowsQtd,
            startY: 30,
            margin: { top: 10, left: 14, right: 14, bottom: 10 },
            theme: 'grid',
            didParseCell: function (data) {
                if (data.row.index === rows.length - 1) {
                    data.cell.styles.fillColor = [211, 211, 211];
                }
            }
        });

        // Salva o PDF.
        doc.save('relatorio_militares.pdf');
    };

    const generateQtdPDF = async () => { // Gera um relatorio com o quantitativo de militares.
        const predefinedRanks = {
            'Cel': 0,
            'TC': allMilitaries.filter(military =>  military.rankName == 'TC').length,
            'Maj': allMilitaries.filter(military =>  military.rankName == 'Maj').length,
            'Cap PTTC': allMilitaries.filter(military =>  military.rankName == 'Cap PTTC').length,
            'Cap': allMilitaries.filter(military =>  military.rankName == 'Cap').length,
            '1º Ten': allMilitaries.filter(military =>  military.rankName == '1º Ten').length,
            '2º Ten': allMilitaries.filter(military =>  military.rankName == '2º Ten').length,
            '2º Ten Reint': allMilitaries.filter(military =>  military.rankName == '2º Ten Reint').length,
            'Asp Of': allMilitaries.filter(military =>  military.rankName == 'Asp Of').length,
            'ST': allMilitaries.filter(military =>  military.rankName == 'ST').length,
            '1º Sgt': allMilitaries.filter(military =>  military.rankName == '1º Sgt').length,
            '2º Sgt': allMilitaries.filter(military =>  military.rankName == '2º Sgt').length,
            '3º Sgt': allMilitaries.filter(military =>  military.rankName == '3º Sgt').length,
            '3º Sgt Reint': allMilitaries.filter(military =>  military.rankName == '3º Sgt Reint').length,
            'Cb':  allMilitaries.filter(military =>  military.rankName == 'Cb').length,
            'Cb Reint':  allMilitaries.filter(military =>  military.rankName == 'Cb Reint').length,
            'Cb EV':  allMilitaries.filter(military =>  military.rankName == 'Cb EV').length,
            'Sd EP':  allMilitaries.filter(military =>  military.rankName == 'Sd EP').length,
            'Sd EP Reint':  allMilitaries.filter(military =>  military.rankName == 'Sd EP Reint').length,
            'Sd EV':  allMilitaries.filter(military =>    military.rankName == 'Sd EV').length,
            'Sd Adido':  allMilitaries.filter(military =>  military.rankName == 'Sd Adido').length,
        };

        const destinations = ['PRONTO', 'FÉRIAS', 'DISP MED', 'DISP REC', 'SSV', 'SERVIÇO'];
        // const otherDestinations = ['ADIDO', 'AGREGADO', 'DISPENSA', 'EST CURSO', 'FALTA', 'INSTALAÇÃO', 'LIBERAÇÃO TEMP', 'LIC PATER', 'MISSÃO', 'SFPC', 'VIAGEM', 'NÚPCIAS', 'DISP DISC FÉRIAS', 'PRESO', 'LUTO', 'CS', 'REINT JUD'];

        // Inicializar a estrutura de contagem por destinos para cada graduação.
        const rankMap = {};
        Object.keys(predefinedRanks).forEach(rank => {
            rankMap[rank] = {
                total: predefinedRanks[rank],
                total_em: allMilitaries.filter(military => (military.rankName == rank && military.subunit_id == '1')).length,
                total_bc: allMilitaries.filter(military => (military.rankName == rank && military.subunit_id == '2')).length,
                total_1: allMilitaries.filter(military => (military.rankName == rank && military.subunit_id == '3')).length,
                total_2: allMilitaries.filter(military => (military.rankName == rank && military.subunit_id == '4')).length,
                total_3: allMilitaries.filter(military => (military.rankName == rank && military.subunit_id == '5')).length,
                pronto: 0,
                ferias: 0,
                dispMed: 0,
                dispRec: 0,
                outros: 0
            };
        });

        // Contar a quantidade de militares por destino para cada graduação.
        filteredMilitaries.forEach(military => {
            const rankName = military.rankName;
            const destination = military.destination;

            if (rankMap[rankName]) {
                if (destination === 'PRONTO' || destination === 'SSV' || destination === 'SERVIÇO' ) {
                    rankMap[rankName].pronto++;
                } else if (destination === 'FÉRIAS') {
                    rankMap[rankName].ferias++;
                } else if (destination === 'DISP MED') {
                    rankMap[rankName].dispMed++;
                } else if (destination === 'DISP REC') {
                    rankMap[rankName].dispRec++;
                } else if (otherDestinations.some(d => d.key === destination)) {
                    rankMap[rankName].outros++;
                }
            }
        });

        // Calcular os totais de cada coluna.
        const total = {
            total: 0,
            total_em: 0,
            total_bc: 0,
            total_1: 0,
            total_2: 0,
            total_3: 0,
            pronto: 0,
            ferias: 0,
            dispMed: 0,
            dispRec: 0,
            outros: 0
        };
        Object.keys(rankMap).forEach(rank => {
            total.total += rankMap[rank].total;
            total.total_em += rankMap[rank].total_em;
            total.total_bc += rankMap[rank].total_bc;
            total.total_1 += rankMap[rank].total_1;
            total.total_2 += rankMap[rank].total_2;
            total.total_3 += rankMap[rank].total_3;
            total.pronto += rankMap[rank].pronto;
            total.ferias += rankMap[rank].ferias;
            total.dispMed += rankMap[rank].dispMed;
            total.dispRec += rankMap[rank].dispRec;
            total.outros += rankMap[rank].outros;
        });

        const doc = new jsPDF();

        // Título do relatório
        const titleFontSize = 12;
        doc.setFontSize(titleFontSize);
        let now = new Date(); 
        const titleText = `Relatório do Mapa da Força do dia ${date}, gerado no dia ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} às ${ now.getHours()}:${now.getMinutes()}`;
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getTextWidth(titleText);
        const textX = (pageWidth - textWidth) / 2;
        doc.text(titleText, textX, 22);

        // Cria a tabela dos dados
        const headers = [['PDG', 'QTD', 'EM', 'BC', '1ª BO', '2ª BO', '3ª BO','PRONTO', 'FÉRIAS', 'DISP MED', 'DISP REC', 'OUTROS']];
        const rows = Object.keys(rankMap).map(rankName => [
            rankName,
            rankMap[rankName].total,
            rankMap[rankName].total_em,
            rankMap[rankName].total_bc,
            rankMap[rankName].total_1,
            rankMap[rankName].total_2,
            rankMap[rankName].total_3,
            rankMap[rankName].pronto,
            rankMap[rankName].ferias,
            rankMap[rankName].dispMed,
            rankMap[rankName].dispRec,
            rankMap[rankName].outros
        ]);

        // Adiciona a linha de total
        rows.push([
            'TOTAL',
            total.total,
            total.total_em,
            total.total_bc,
            total.total_1,
            total.total_2,
            total.total_3,
            total.pronto,
            total.ferias,
            total.dispMed,
            total.dispRec,
            total.outros
        ]);

        doc.autoTable({
            head: headers,
            body: rows,
            startY: 30,
            margin: { top: 10, left: 14, right: 14, bottom: 10 },
            theme: 'grid',
            didParseCell: function (data) {
                if (data.row.index === rows.length - 1) {
                    data.cell.styles.fillColor = [211, 211, 211];
                }
            }
        });

        // Salva o PDF.
        doc.save('quantitativo_militares.pdf');
    };


    return (
        <Container fluid className='d-grid gap-1 mb-3'>
            <Container fluid>

                <Row>
                    <Col md={6} lg={3} sm={12} xs={12}>
                        <Card className='card' style={{ border: 'none' }}>
                            <Card.Body className='filterCard'>
                                <Container fluid>
                                    <Row>

                                        <p>Filtros do gerador de Relatórios</p>

                                        {/* Filtro do gerador de pdf */}
                                        <Row className='justify-content-end'> {/* Função para gerar relatorio em PDF. */}

                                        </Row>
                                        <Accordion>
                                            <AccordionItem eventKey="0">
                                                <AccordionHeader>Data</AccordionHeader>
                                                <AccordionBody>
                                                    <Form>
                                                        <Form.Control type="date" value={date} onChange={(e) => { setDate(e?.target?.value) }} onBlur={fetchMilitariesDate} />
                                                    </Form>
                                                </AccordionBody>
                                            </AccordionItem>
                                            <AccordionItem eventKey="1">
                                                <AccordionHeader>Subunidades</AccordionHeader>
                                                <AccordionBody>
                                                    <Form>
                                                        <Form.Check
                                                                key={'Todos'}
                                                                type="checkbox"
                                                                id={'Todos'}
                                                                label={'Todos'}
                                                                value={'Todos'}
                                                                onChange={handleCheckboxAllSubunits}
                                                        />
                                                        {subunits.map((subunit) => (
                                                            <Form.Check
                                                                key={subunit.value}
                                                                type="checkbox"
                                                                id={subunit.value}
                                                                name={'subunits'}
                                                                label={subunit.key}
                                                                value={subunit.value}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                        ))}
                                                    </Form>
                                                </AccordionBody>
                                            </AccordionItem>

                                            <AccordionItem eventKey="2">
                                                <AccordionHeader>Destinos</AccordionHeader>
                                                <AccordionBody>
                                                    <Form>
                                                        <Form.Check
                                                                key={'Todos'}
                                                                type="checkbox"
                                                                id={'Todos'}
                                                                label={'Todos'}
                                                                value={'Todos'}
                                                                onChange={handleCheckboxAllDestinations}
                                                        />
                                                        {destinations.map((destination) => (
                                                            <Form.Check
                                                                key={destination.value}
                                                                type="checkbox"
                                                                id={destination.value}
                                                                name={'destination'}
                                                                label={destination.key}
                                                                value={destination.value}
                                                                onChange={handleCheckboxChangeDestination}
                                                            />
                                                        ))}
                                                    </Form>
                                                </AccordionBody>
                                            </AccordionItem>

                                            <AccordionItem eventKey="3">
                                                <AccordionHeader>Seções/Funções</AccordionHeader>
                                                <AccordionBody>
                                                    <Form>
                                                        <Form.Check
                                                                key={'Todos'}
                                                                type="checkbox"
                                                                id={'Todos'}
                                                                label={'Todos'}
                                                                value={'Todos'}
                                                                onChange={handleCheckboxAllWorkplaces}
                                                        />
                                                        {workplaces.map((workplace) => (
                                                            <Form.Check
                                                                key={workplace.value}
                                                                type="checkbox"
                                                                id={workplace.value}
                                                                name={'workplace'}
                                                                label={workplace.key}
                                                                value={workplace.value}
                                                                onChange={handleCheckboxChangeWorkplace}
                                                            />
                                                        ))}
                                                    </Form>
                                                </AccordionBody>
                                            </AccordionItem>

                                            <AccordionItem eventKey="4">
                                                <AccordionHeader>Pesquisar por nome</AccordionHeader>
                                                <AccordionBody>
                                                    <Form>
                                                        <Form.Control
                                                            onKeyPress={e => {
                                                                if (e.key === 'Enter') e.preventDefault();
                                                            }}
                                                            value={search}
                                                            placeholder='digite um nome...'
                                                            onChange={(e) => { setSearch(e?.target?.value) }}
                                                        />
                                                    </Form>
                                                </AccordionBody>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* Botão para atualizar a lista com os filtros. */}
                                        <Button className="mt-3 btn-success" onClick={handleSubmit}>
                                            Atualizar
                                        </Button>
                                        <Button className="mt-3 btn-secondary" onClick={() => generatePDF()}>
                                            Gerar Relatório PDF
                                        </Button>
                                        <Button className="mt-3 btn-secondary" onClick={() => generateQtdPDF()}>
                                            Quantitativo
                                        </Button>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Col>
                            <Card className='bg-dark text-light card-line p-2'>
                                <Row className='text-center'>
                                    <Col>Militar</Col>
                                    <Col>Número</Col>
                                    <Col>Seção</Col>
                                    <Col>Subunidade</Col>
                                    <Col>Destino</Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col style={{ maxHeight: "85vh", overflowY: "auto" }}>
                                {filteredMilitaries.length > 0 ? (
                                    filteredMilitaries.map((row, index) => (
                                        <Card key={row.id || index} className='card-line p-2'>
                                            <Row className='text-center'>
                                                <Col>{row.military_name}</Col>
                                                <Col>{row.number}</Col>
                                                <Col>{row.workplace}</Col>
                                                <Col>{row.subunitName}</Col>
                                                <Col className='text-success'>
                                                    {row.destination}
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))
                                ) : (
                                    <p className='text-light'>Nenhum militar encontrado para os filtros selecionados.</p>
                                )}
                        </Col>
                    </Col>
                </Row>

            </Container>
        </Container>
    )
}