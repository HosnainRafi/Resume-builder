import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', padding: 35, fontSize: 10, lineHeight: 1.5 },
  header: { textAlign: 'center', marginBottom: 20 },
  name: { fontSize: 28, fontWeight: 'bold' },
  contact: { color: '#555', marginTop: 4, fontSize: 10 },
  columns: { flexDirection: 'row', gap: 20 },
  mainCol: { flex: 2 },
  sideCol: { flex: 1 },
  section: { marginBottom: 15 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4CAF50',
    textTransform: 'uppercase',
    borderBottom: 1.5,
    borderBottomColor: '#eee',
    paddingBottom: 4,
    marginBottom: 10,
  },
  item: { marginBottom: 10 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  itemTitle: { fontSize: 11, fontWeight: 'bold' },
  itemDate: { fontSize: 10, color: '#666' },
  itemSubheader: { marginVertical: 1 },
});

const StudentEntryLevelTemplate = ({ resumeData }) => {
  const {
    header = {},
    education = [],
    skills = [],
    projects = [],
    experience = [],
  } = resumeData || {};
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{header.name || ''}</Text>
          <Text
            style={styles.contact}
          >{`${header.email || ''} | ${header.phone || ''} | ${header.website || ''}`}</Text>
        </View>
        <View style={styles.columns}>
          <View style={styles.mainCol}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {(Array.isArray(education) ? education : []).map((edu, i) => (
                <View key={i} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>
                      {edu.institution || ''}
                    </Text>
                    <Text style={styles.itemDate}>
                      {edu.graduationDate || ''}
                    </Text>
                  </View>
                  <Text style={styles.itemSubheader}>{edu.degree || ''}</Text>
                  <Text>Relevant Coursework: {edu.coursework || ''}</Text>
                </View>
              ))}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {(Array.isArray(projects) ? projects : []).map((proj, i) => (
                <View key={i} style={styles.item}>
                  <Text style={styles.itemTitle}>{proj.name || ''}</Text>
                  <Text>{proj.description || ''}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.sideCol}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <Text>{(Array.isArray(skills) ? skills : []).join(', ')}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {(Array.isArray(experience) ? experience : []).map((exp, i) => (
                <View key={i} style={styles.item}>
                  <Text style={styles.itemTitle}>{exp.jobTitle || ''}</Text>
                  <Text
                    style={styles.itemSubheader}
                  >{`${exp.company || ''} | ${exp.startDate || ''} - ${exp.endDate || ''}`}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default StudentEntryLevelTemplate;
