import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: { fontSize: 24, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  section: { margin: 10, padding: 10, fontSize: 12 },
  bold: { fontWeight: 'bold' }
});

export const AsoDocument = ({ patientName, companyName, status }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Atestado de Saúde Ocupacional (ASO)</Text>
      
      <View style={styles.section}>
        <Text>Atestamos para os devidos fins que o funcionário(a):</Text>
        <Text style={styles.bold}>{patientName}</Text>
      </View>

      <View style={styles.section}>
        <Text>Empresa: {companyName}</Text>
        <Text>Status: <Text style={styles.bold}>{status}</Text></Text>
      </View>

      <View style={styles.section}>
        <Text>Assinatura do Médico Examinador:</Text>
        <Text>________________________________________________</Text>
      </View>
    </Page>
  </Document>
);