
'use client';

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9, fontFamily: 'Helvetica', color: '#333' },
  header: { 
    flexDirection: 'row', 
    marginBottom: 25, 
    borderBottomWidth: 1, 
    borderBottomColor: '#090e24', 
    borderBottomStyle: 'solid',
    paddingBottom: 15, 
    alignItems: 'center' 
  },
  logo: { width: 140, objectFit: 'contain' },
  titleBlock: { marginLeft: 'auto', textAlign: 'right' },
  docTitle: { fontSize: 14, fontWeight: 'bold', color: '#090e24', textTransform: 'uppercase' },
  companyName: { fontSize: 10, marginTop: 4, fontWeight: 'bold' },
  
  section: { marginBottom: 20 },
  sectionHeader: { 
    backgroundColor: '#f8f9fa', 
    padding: 6, 
    borderLeftWidth: 4, 
    borderLeftColor: '#f59e0b', 
    borderLeftStyle: 'solid',
    marginBottom: 10 
  },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#090e24', textTransform: 'uppercase' },
  
  table: { 
    display: 'flex', 
    width: 'auto', 
    borderStyle: 'solid', 
    borderWidth: 0.5, 
    borderColor: '#bfbfbf', 
    marginTop: 10 
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#bfbfbf', 
    borderBottomStyle: 'solid',
    minHeight: 25, 
    alignItems: 'center' 
  },
  tableHeader: { backgroundColor: '#090e24', color: '#fff', fontWeight: 'bold' },
  tableCell: { padding: 5, flex: 1 },
  
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  infoItem: { width: '50%', marginBottom: 8 },
  label: { fontWeight: 'bold', fontSize: 8, color: '#666', textTransform: 'uppercase' },
  value: { fontSize: 9, marginTop: 2 },
  
  aiInsight: { 
    backgroundColor: '#fffbeb', 
    borderWidth: 1, 
    borderColor: '#fef3c7', 
    borderStyle: 'solid',
    padding: 15, 
    marginTop: 20, 
    borderRadius: 4 
  },
  aiTitle: { fontSize: 10, fontWeight: 'bold', color: '#92400e', marginBottom: 5 },
  aiText: { fontStyle: 'italic', lineHeight: 1.4 },
  
  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    right: 40, 
    borderTopWidth: 0.5, 
    borderTopColor: '#eee', 
    borderTopStyle: 'solid',
    paddingTop: 10, 
    textAlign: 'center', 
    fontSize: 7, 
    color: '#999' 
  },
  signatureBlock: { marginTop: 40, alignItems: 'center' },
  line: { 
    width: 180, 
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
    borderBottomStyle: 'solid',
    marginBottom: 4 
  },
  signerName: { fontSize: 10, fontWeight: 'bold' }
});

// Logo padrão da Nextcon como fallback caso a empresa não tenha uma própria
const NEXTCON_LOGO = "https://firebasestorage.googleapis.com/v0/b/studio-8439299034-125c7.firebasestorage.app/o/public%2Fnextcon-logo-horizontal.png?alt=media";

interface DocProps {
  data: any;
  company: any;
  type: 'PGR' | 'LTCAT' | 'PCMSO';
}

export const SSTDocument = ({ data, company, type }: DocProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* CABEÇALHO DINÂMICO: Prioriza a logo da empresa cadastrada */}
      <View style={styles.header}>
        <Image 
          src={company?.logoUrl || data?.companyInfo?.logoUrl || NEXTCON_LOGO} 
          style={styles.logo} 
        />
        <View style={styles.titleBlock}>
          <Text style={styles.docTitle}>
            {type} - {type === 'PGR' ? 'Gerenciamento de Riscos' : type === 'LTCAT' ? 'Laudo Ambiental' : 'Controle Médico'}
          </Text>
          <Text style={styles.companyName}>{company?.name || data?.companyInfo?.name || 'Cliente Nextcon'}</Text>
          <Text style={{ fontSize: 8, color: '#666' }}>CNPJ: {company?.cnpj || 'Consultar cadastro eSocial'}</Text>
        </View>
      </View>

      {/* DADOS DA EMPRESA */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Identificação da Unidade Gestora</Text>
        </View>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Cidade/UF de Atuação</Text>
            <Text style={styles.value}>{company?.city || 'Unidade Operacional'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Vigência do Documento</Text>
            <Text style={styles.value}>{data?.companyInfo?.validity || data?.companyInfo?.date || new Date().toLocaleDateString()}</Text>
          </View>
          {type === 'PCMSO' && (
            <View style={styles.infoItem}>
              <Text style={styles.label}>Médico Coordenador Responsável</Text>
              <Text style={styles.value}>{data?.companyInfo?.responsibleDoctor || 'A definir conforme PCMSO'}</Text>
            </View>
          )}
        </View>
      </View>

      {/* CONTEÚDO TÉCNICO EXTRAÍDO PELA NAI */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {type === 'PGR' ? 'Inventário de Riscos Ocupacionais' : 
             type === 'LTCAT' ? 'Levantamento de Agentes Nocivos (NR-15)' : 
             'Cronograma de Exames Médicos (NR-07)'}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Descrição Técnica / Agente</Text>
            <Text style={styles.tableCell}>{type === 'PCMSO' ? 'Periodicidade' : 'Critério Legal'}</Text>
            <Text style={styles.tableCell}>{type === 'PCMSO' ? 'Público Alvo' : 'Status/Enquadramento'}</Text>
          </View>

          {type === 'PGR' && data?.identifiedRisks?.map((r: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{r.hazard} ({r.category})</Text>
              <Text style={styles.tableCell}>NR-01 / NR-09</Text>
              <Text style={styles.tableCell}>Sob Controle</Text>
            </View>
          ))}

          {type === 'LTCAT' && data?.hazards?.map((h: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{h.agent} - Medição: {h.intensity}</Text>
              <Text style={styles.tableCell}>{h.limit || 'NR-15'}</Text>
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

      {/* CONCLUSÃO ESTRATÉGICA NAI */}
      <View style={styles.aiInsight}>
        <Text style={styles.aiTitle}>Parecer Técnico NAI Intelligence 2026</Text>
        <Text style={styles.aiText}>{data?.aiInsight}</Text>
      </View>

      {/* ASSINATURA AUTOMÁTICA */}
      <View style={styles.signatureBlock}>
        <View style={styles.line} />
        <Text style={styles.signerName}>Nextcon Saúde Empresarial</Text>
        <Text style={{ fontSize: 8 }}>Responsável Técnico SST - Gerado via IA</Text>
      </View>

      <Text style={styles.footer}>
        Documento gerado eletronicamente pela Plataforma NAI em {new Date().toLocaleString()} - Automação SST 360°
      </Text>
    </Page>
  </Document>
);
