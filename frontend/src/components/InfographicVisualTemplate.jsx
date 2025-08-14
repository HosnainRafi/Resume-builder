import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', flexDirection: 'row' },
  leftCol: {
    width: '35%',
    backgroundColor: '#008080',
    color: 'white',
    padding: 30,
    textAlign: 'center',
  },
  rightCol: { width: '65%', backgroundColor: '#fff', padding: 30 },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 'auto',
    marginBottom: 15,
  },
  name: { fontSize: 24, fontWeight: 'bold' },
  title: { fontSize: 13, fontWeight: 'light', marginBottom: 25 },
  leftSection: { textAlign: 'left', fontSize: 10, marginBottom: 20 },
  leftTitle: { fontSize: 13, textTransform: 'uppercase', marginBottom: 10 },
  rightTitle: {
    fontSize: 16,
    color: '#008080',
    borderBottom: 2,
    borderBottomColor: '#008080',
    paddingBottom: 5,
    marginBottom: 15,
  },
  rightSection: { marginBottom: 20, fontSize: 10, lineHeight: 1.4 },
  item: {
    position: 'relative',
    paddingLeft: 15,
    marginBottom: 10,
    borderLeft: 1,
    borderLeftColor: '#eee',
  },
  itemTitle: { fontWeight: 'bold' },
});

const InfographicVisualTemplate = ({ resumeData }) => {
  const { header = {}, experience = [], skills = [] } = resumeData || {};
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.leftCol}>
          <View style={styles.photoPlaceholder} />
          <Text style={styles.name}>{header.name || ''}</Text>
          <Text style={styles.title}>{header.title || ''}</Text>
          <View style={styles.leftSection}>
            <Text style={styles.leftTitle}>Contact</Text>
            <Text>{header.email}</Text>
            <Text>{header.phone}</Text>
          </View>
          <View style={styles.leftSection}>
            <Text style={styles.leftTitle}>Skills</Text>
            {(Array.isArray(skills) ? skills : []).map((s) => (
              <Text key={s}>{s}</Text>
            ))}
          </View>
        </View>
        <View style={styles.rightCol}>
          <View style={styles.rightSection}>
            <Text style={styles.rightTitle}>Profile</Text>
            <Text>{header.summary}</Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.rightTitle}>Experience</Text>
            {(Array.isArray(experience) ? experience : []).map((exp, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
                <Text>{exp.company}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default InfographicVisualTemplate;
