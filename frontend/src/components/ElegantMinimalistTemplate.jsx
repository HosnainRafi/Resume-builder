import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    padding: 40,
    color: '#222',
    fontSize: 11,
    lineHeight: 1.6,
  },
  header: { textAlign: 'center', marginBottom: 25 },
  name: { fontSize: 30, letterSpacing: 2, textTransform: 'uppercase' },
  contact: { fontSize: 10, marginTop: 5 },
  section: { marginBottom: 15 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingBottom: 5,
    borderBottom: 1,
    borderBottomColor: '#ccc',
  },
  summary: { textAlign: 'center', fontStyle: 'italic' },
  item: { marginBottom: 10 },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  itemTitle: { fontSize: 12, fontWeight: 'bold' },
  itemDate: { fontSize: 10, color: '#555', fontStyle: 'italic' },
  itemDescription: { fontSize: 11 },
  skills: { textAlign: 'center', fontSize: 11 },
});

const ElegantMinimalistTemplate = ({ resumeData }) => {
  const {
    header = {},
    experience = [],
    education = [],
    skills = [],
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{header.summary || ''}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {(Array.isArray(experience) ? experience : []).map((exp, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text
                  style={styles.itemTitle}
                >{`${exp.jobTitle || ''} at ${exp.company || ''}`}</Text>
                <Text
                  style={styles.itemDate}
                >{`${exp.location || ''} | ${exp.startDate || ''} - ${exp.endDate || ''}`}</Text>
              </View>
              <Text style={styles.itemDescription}>
                {exp.description || ''}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {(Array.isArray(education) ? education : []).map((edu, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemTitle}>{edu.degree || ''}</Text>
              <Text
                style={styles.itemDate}
              >{`${edu.institution || ''}, ${edu.graduationDate || ''}`}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Competencies</Text>
          <Text style={styles.skills}>
            {(Array.isArray(skills) ? skills : []).join(' · ')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
export default ElegantMinimalistTemplate;
