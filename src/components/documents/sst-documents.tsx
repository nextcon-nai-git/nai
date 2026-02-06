
'use client';

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9, fontFamily: 'Helvetica', color: '#333' },
  header: { flexDirection: 'row', marginBottom: 25, borderBottom: 1, borderColor: '#090e24', paddingBottom: 15, alignItems: 'center' },
  logo: { width: 140 },
  titleBlock: { marginLeft: 'auto', textAlign: 'right' },
  docTitle: { fontSize: 14, fontWeight: 'bold', color: '#090e24', textTransform: 'uppercase' },
  companyName: { fontSize: 10, marginTop: 4, fontWeight: 'bold' },
  
  section: { marginBottom: 20 },
  sectionHeader: { backgroundColor: '#f8f9fa', padding: 6, borderLeft: 4, borderColor: '#f59e0b', marginBottom: 10 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#090e24', textTransform: 'uppercase' },
  
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 0.5, borderColor: '#bfbfbf', marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderColor: '#bfbfbf', minHeight: 25, alignItems: 'center' },
  tableHeader: { backgroundColor: '#090e24', color: '#fff', fontWeight: 'bold' },
  tableCell: { padding: 5, flex: 1 },
  
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  infoItem: { width: '50%', marginBottom: 8 },
  label: { fontWeight: 'bold', fontSize: 8, color: '#666', textTransform: 'uppercase' },
  value: { fontSize: 9, marginTop: 2 },
  
  aiInsight: { backgroundColor: '#fffbeb', border: 1, borderColor: '#fef3c7', padding: 15, marginTop: 20, borderRadius: 4 },
  aiTitle: { fontSize: 10, fontWeight: 'bold', color: '#92400e', marginBottom: 5 },
  aiText: { fontStyle: 'italic', lineHeight: 1.4 },
  
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTop: 0.5, borderColor: '#eee', paddingTop: 10, textAlign: 'center', fontSize: 7, color: '#999' },
  signatureBlock: { marginTop: 40, alignItems: 'center' },
  line: { width: 180, borderBottom: 1, borderColor: '#000', marginBottom: 4 },
  signerName: { fontSize: 10, fontWeight: 'bold' }
});

// Logo base64 ou URL pública da Nextcon
const NEXTCON_LOGO = "https://firebasestorage.googleapis.com/v0/b/studio-8439299034-125c7.firebasestorage.app/o/public%2Fnextcon-logo-horizontal.png?alt=media";

interface DocProps {
  data: any;
  company: any;
  type: 'PGR' | 'LTCAT' | 'PCMSO';
}

export const SSTDocument = ({ data, company, type }: DocProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Image src={NEXTCON_LOGO} style={styles.logo} />
        <View style={styles.titleBlock}>
          <Text style={styles.docTitle}>{type} - {type === 'PGR' ? 'Gerenciamento de Riscos' : type === 'LTCAT' ? 'Laudo Ambiental' : 'Controle Médico'}</Text>
          <Text style={styles.companyName}>{company?.name || data?.companyInfo?.name}</Text>
          <Text style={{ fontSize: 8, color: '#666' }}>CNPJ: {company?.cnpj || 'Consulte o cadastro'}</Text>
        </View>
      </View>

      {/* DADOS DA EMPRESA */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Identificação da Unidade</Text>
        </View>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Cidade/UF</Text>
            <Text style={styles.value}>{company?.city || 'Curitiba/PR'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Vigência/Data</Text>
            <Text style={styles.value}>{data?.companyInfo?.validity || data?.companyInfo?.date || new Date().toLocaleDateString()}</Text>
          </View>
          {type === 'PCMSO' && (
            <View style={styles.infoItem}>
              <Text style={styles.label}>Médico Coordenador</Text>
              <Text style={styles.value}>{data?.companyInfo?.responsibleDoctor || 'A definir'}</Text>
            </View>
          )}
        </View>
      </View>

      {/* CONTEÚDO TÉCNICO DINÂMICO */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {type === 'PGR' ? 'Inventário de Riscos Ocupacionais' : 
             type === 'LTCAT' ? 'Levantamento de Agentes Nocivos' : 
             'Cronograma de Exames Médicos'}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Descrição / Agente</Text>
            <Text style={styles.tableCell}>{type === 'PCMSO' ? 'Periodicidade' : 'Critério/Limite'}</Text>
            <Text style={styles.tableCell}>{type === 'PCMSO' ? 'Público Alvo' : 'Status/Enquadramento'}</Text>
          </View>

          {type === 'PGR' && data?.identifiedRisks?.map((r: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{r.hazard} ({r.category})</Text>
              <Text style={styles.tableCell}>NR-01 / NR-09</Text>
              <Text style={styles.tableCell}>Controlado</Text>
            </View>
          ))}

          {type === 'LTCAT' && data?.hazards?.map((h: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{h.agent} - Medição: {h.intensity}</Text>
              <Text style={styles.tableCell}>{h.limit}</Text>
              <Text style={styles.tableCell}>{h.specialRetirement ? 'APOS. ESPECIAL' : 'Comum'}</Text>
            </View>
          ))}

          {type === 'PCMSO' && data?.examProtocol?.map((e: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{e.examName}</Text>
              <Text style={styles.tableCell}>{e.periodicity}</Text>
              <Text style={styles.tableCell}>{e.targetGroup}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* INSIGHT ESTRATÉGICO NAI */}
      <View style={styles.aiInsight}>
        <Text style={styles.aiTitle}>Conclusão & Insights NAI Intelligence</Text>
        <Text style={styles.aiText}>{data?.aiInsight}</Text>
      </View>

      {/* ASSINATURA */}
      <View style={styles.signatureBlock}>
        <View style={styles.line} />
        <Text style={styles.signerName}>Nextcon Saúde Empresarial</Text>
        <Text style={{ fontSize: 8 }}>Responsável Técnico SST</Text>
      </View>

      <Text style={styles.footer}>
        Documento gerado eletronicamente pela Plataforma NAI Nextcon em {new Date().toLocaleString()} - www.nextcon.com.br
      </Text>
    </Page>
  </Document>
);
