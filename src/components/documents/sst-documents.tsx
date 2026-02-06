'use client';

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9, fontFamily: 'Helvetica', color: '#333' },
  header: { 
    flexDirection: 'row', 
    marginBottom: 25, 
    borderBottomWidth: 2, 
    borderBottomColor: '#002d9c', 
    borderBottomStyle: 'solid',
    paddingBottom: 15, 
    alignItems: 'center' 
  },
  logo: { width: 160, objectFit: 'contain' },
  titleBlock: { marginLeft: 'auto', textAlign: 'right' },
  docTitle: { fontSize: 14, fontWeight: 'bold', color: '#002d9c', textTransform: 'uppercase' },
  companyName: { fontSize: 10, marginTop: 4, fontWeight: 'bold' },
  
  section: { marginBottom: 20 },
  sectionHeader: { 
    backgroundColor: '#f0f7ff', 
    padding: 8, 
    borderLeftWidth: 4, 
    borderLeftColor: '#00b4ff', 
    borderLeftStyle: 'solid',
    marginBottom: 10 
  },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#002d9c', textTransform: 'uppercase' },
  
  table: { 
    display: 'flex', 
    width: 'auto', 
    borderStyle: 'solid', 
    borderWidth: 0.5, 
    borderColor: '#e5e7eb', 
    marginTop: 10 
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#e5e7eb', 
    borderBottomStyle: 'solid',
    minHeight: 25, 
    alignItems: 'center' 
  },
  tableHeader: { backgroundColor: '#002d9c', color: '#fff', fontWeight: 'bold' },
  tableCell: { padding: 6, flex: 1 },
  
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  infoItem: { width: '50%', marginBottom: 10 },
  label: { fontWeight: 'bold', fontSize: 8, color: '#6b7280', textTransform: 'uppercase' },
  value: { fontSize: 9, marginTop: 2, color: '#111827' },
  
  aiInsight: { 
    backgroundColor: '#f0f9ff', 
    borderWidth: 1, 
    borderColor: '#bae6fd', 
    borderStyle: 'solid',
    padding: 15, 
    marginTop: 20, 
    borderRadius: 8 
  },
  aiTitle: { fontSize: 10, fontWeight: 'bold', color: '#0369a1', marginBottom: 5 },
  aiText: { fontStyle: 'italic', lineHeight: 1.5, color: '#075985' },
  
  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    right: 40, 
    borderTopWidth: 0.5, 
    borderTopColor: '#e5e7eb', 
    borderTopStyle: 'solid',
    paddingTop: 10, 
    textAlign: 'center', 
    fontSize: 7, 
    color: '#9ca3af' 
  },
  signatureBlock: { marginTop: 50, alignItems: 'center' },
  line: { 
    width: 180, 
    borderBottomWidth: 1, 
    borderBottomColor: '#002d9c', 
    borderBottomStyle: 'solid',
    marginBottom: 4 
  },
  signerName: { fontSize: 10, fontWeight: 'bold', color: '#002d9c' }
});

// Logo oficial convertida ou fallback de qualidade
const NEXTCON_LOGO = "https://firebasestorage.googleapis.com/v0/b/studio-8439299034-125c7.firebasestorage.app/o/public%2Fnextcon-logo-horizontal.png?alt=media";

interface DocProps {
  data: any;
  company: any;
  type: 'PGR' | 'LTCAT' | 'PCMSO';
}

export const SSTDocument = ({ data, company, type }: DocProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* CABEÇALHO DINÂMICO */}
      <View style={styles.header}>
        <Image 
          src={company?.logoUrl || NEXTCON_LOGO} 
          style={styles.logo} 
        />
        <View style={styles.titleBlock}>
          <Text style={styles.docTitle}>
            {type} - {type === 'PGR' ? 'Gerenciamento de Riscos' : type === 'LTCAT' ? 'Laudo Ambiental' : 'Controle Médico'}
          </Text>
          <Text style={styles.companyName}>{company?.name || data?.companyInfo?.name || 'Cliente Nextcon'}</Text>
          <Text style={{ fontSize: 8, color: '#6b7280' }}>Gerado via Plataforma NAI Intelligence 2026</Text>
        </View>
      </View>

      {/* DADOS DA EMPRESA */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Identificação Técnica</Text>
        </View>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>CNPJ do Cliente</Text>
            <Text style={styles.value}>{company?.cnpj || data?.companyInfo?.cnpj || 'Consulte eSocial'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Vigência / Data</Text>
            <Text style={styles.value}>{data?.companyInfo?.validity || data?.companyInfo?.date || new Date().toLocaleDateString()}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Cidade / Unidade</Text>
            <Text style={styles.value}>{company?.city || 'Unidade Gestora'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Segmento</Text>
            <Text style={styles.value}>{company?.segment === 'INDUSTRY' ? 'Indústria' : company?.segment === 'CONSTRUCTION' ? 'Construção Civil' : 'Gestão Geral'}</Text>
          </View>
        </View>
      </View>

      {/* CONTEÚDO TÉCNICO */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {type === 'PGR' ? 'Inventário de Riscos Ocupacionais (NR-01)' : 
             type === 'LTCAT' ? 'Agentes Nocivos & Enquadramento (NR-15)' : 
             'Protocolos de Saúde (NR-07)'}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Descrição Técnica</Text>
            <Text style={styles.tableCell}>Periodicidade/Base</Text>
            <Text style={styles.tableCell}>Status eSocial</Text>
          </View>

          {type === 'PGR' && data?.identifiedRisks?.map((r: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{r.hazard} ({r.category})</Text>
              <Text style={styles.tableCell}>NR-01 / S-2240</Text>
              <Text style={styles.tableCell}>Transmitido</Text>
            </View>
          ))}

          {type === 'LTCAT' && data?.hazards?.map((h: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{h.agent} ({h.intensity})</Text>
              <Text style={styles.tableCell}>{h.limit || 'NR-15'}</Text>
              <Text style={styles.tableCell}>{h.specialRetirement ? 'APOS. ESP.' : 'Comum'}</Text>
            </View>
          ))}

          {type === 'PCMSO' && data?.examProtocol?.map((e: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{e.examName} ({e.targetGroup})</Text>
              <Text style={styles.tableCell}>{e.periodicity}</Text>
              <Text style={styles.tableCell}>NR-07 / S-2220</Text>
            </View>
          ))}
        </View>
      </View>

      {/* PARECER IA */}
      <View style={styles.aiInsight}>
        <Text style={styles.aiTitle}>Conclusão Técnica NAI Intelligence</Text>
        <Text style={styles.aiText}>{data?.aiInsight}</Text>
      </View>

      {/* ASSINATURA */}
      <View style={styles.signatureBlock}>
        <View style={styles.line} />
        <Text style={styles.signerName}>Nextcon Saúde Empresarial</Text>
        <Text style={{ fontSize: 8, color: '#6b7280' }}>Gestão de Segurança e Saúde Ocupacional 360°</Text>
      </View>

      <Text style={styles.footer}>
        Este documento foi gerado digitalmente pela Nextcon Saúde Empresarial em {new Date().toLocaleString()}
      </Text>
    </Page>
  </Document>
);
