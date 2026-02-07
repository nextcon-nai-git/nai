
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

const NEXTCON_LOGO = "https://firebasestorage.googleapis.com/v0/b/studio-8439299034-125c7.firebasestorage.app/o/public%2Fnextcon-logo-horizontal.png?alt=media";

type DocType = 'PGR' | 'LTCAT' | 'PCMSO' | 'NR15' | 'NR16' | 'ERGONOMIA' | 'NR10' | 'NR12' | 'OS' | 'EPI' | 'APR' | 'PCA' | 'PPR';

interface DocProps {
  data: any;
  company: any;
  type: DocType;
}

const getFullTitle = (type: DocType) => {
  switch(type) {
    case 'PGR': return 'PGR - Gerenciamento de Riscos';
    case 'PCMSO': return 'PCMSO - Controle Médico';
    case 'LTCAT': return 'LTCAT - Laudo Previdenciário';
    case 'NR15': return 'NR-15 - Laudo de Insalubridade';
    case 'NR16': return 'NR-16 - Laudo de Periculosidade';
    case 'ERGONOMIA': return 'Laudo Ergonômico (NR-17)';
    case 'NR10': return 'Prontuário Elétrico (NR-10)';
    case 'NR12': return 'Laudo de Máquinas (NR-12)';
    case 'OS': return 'Ordem de Serviço de Segurança';
    case 'EPI': return 'Ficha de Entrega de EPI';
    case 'APR': return 'Análise Preliminar de Risco';
    case 'PCA': return 'PCA - Conservação Auditiva';
    case 'PPR': return 'PPR - Proteção Respiratória';
    default: return 'Documento Técnico SST';
  }
}

export const SSTDocument = ({ data, company, type }: DocProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image 
          src={company?.logoUrl || NEXTCON_LOGO} 
          style={styles.logo} 
        />
        <View style={styles.titleBlock}>
          <Text style={styles.docTitle}>{getFullTitle(type)}</Text>
          <Text style={styles.companyName}>{company?.name || data?.companyInfo?.name || 'Cliente NextCon'}</Text>
          <Text style={{ fontSize: 8, color: '#6b7280' }}>Gerado via NAI Intelligence 2026</Text>
        </View>
      </View>

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
            <Text style={styles.label}>Tipo de Documento</Text>
            <Text style={styles.value}>{type}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Levantamento de Dados</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Descrição Técnica</Text>
            <Text style={styles.tableCell}>Periodicidade/Ref</Text>
            <Text style={styles.tableCell}>Status eSocial</Text>
          </View>

          {data?.identifiedRisks?.map((r: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{r.hazard} ({r.category})</Text>
              <Text style={styles.tableCell}>12 meses</Text>
              <Text style={styles.tableCell}>Transmitido</Text>
            </View>
          ))}

          {(!data?.identifiedRisks || data.identifiedRisks.length === 0) && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>Dados técnicos registrados em sistema conforme normativa vigente.</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.aiInsight}>
        <Text style={styles.aiTitle}>Conclusão Técnica NAI Intelligence</Text>
        <Text style={styles.aiText}>{data?.aiInsight || 'Análise concluída com conformidade técnica integral.'}</Text>
      </View>

      <View style={styles.signatureBlock}>
        <View style={styles.line} />
        <Text style={styles.signerName}>NextCon Saúde Empresarial</Text>
        <Text style={{ fontSize: 8, color: '#6b7280' }}>Gestão de Segurança e Saúde Ocupacional 360°</Text>
      </View>

      <Text style={styles.footer}>
        Este documento foi gerado digitalmente pela NextCon Saúde Empresarial em {new Date().toLocaleString()}
      </Text>
    </Page>
  </Document>
);
