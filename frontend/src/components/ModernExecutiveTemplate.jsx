import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', flexDirection: 'row' },
  leftCol: {
    width: '33%',
    backgroundColor: '#343a40',
    color: '#f8f9fa',
    padding: 30,
  },
  rightCol: { width: '67%', padding: 30 },
  name: { fontSize: 30, color: '#c5a572', lineHeight: 1.2 },
  title: {
    fontSize: 14,
    fontWeight: 'light',
    borderBottom: 1,
    borderBottomColor: '#495057',
    paddingBottom: 15,
    marginBottom: 20,
  },
  leftSection: { fontSize: 10, lineHeight: 1.6, marginBottom: 15 },
  leftTitle: {
    color: '#c5a572',
    fontSize: 13,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  rightSection: { marginBottom: 20, fontSize: 11, lineHeight: 1.6 },
  rightTitle: { fontSize: 18, color: '#343a40', marginBottom: 10 },
  item: { marginBottom: 10 },
  itemTitle: { fontSize: 13, fontWeight: 'bold' },
  itemSubheader: {
    fontSize: 11,
    color: '#6c757d',
    fontStyle: 'italic',
    marginBottom: 3,
  },
});

const ModernExecutiveTemplate = ({ resumeData }) => {
  const { header = {}, experience = [], skills = [] } = resumeData || {};
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.leftCol}>
          <Text style={styles.name}>{header.name || ''}</Text>
          <Text style={styles.title}>{header.title || ''}</Text>
          <View style={styles.leftSection}>
            <Text style={styles.leftTitle}>Contact</Text>
            <Text>{header.phone}</Text>
            <Text>{header.email}</Text>
            <Text>{header.website}</Text>
          </View>
          <View style={styles.leftSection}>
            <Text style={styles.leftTitle}>Expertise</Text>
            {(Array.isArray(skills) ? skills : []).map((s) => (
              <Text key={s}>• {s}</Text>
            ))}
          </View>
        </View>
        <View style={styles.rightCol}>
          <View style={styles.rightSection}>
            <Text style={styles.rightTitle}>Executive Summary</Text>
            <Text>{header.summary}</Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.rightTitle}>Professional Experience</Text>
            {(Array.isArray(experience) ? experience : []).map((exp, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
                <Text
                  style={styles.itemSubheader}
                >{`${exp.company} | ${exp.startDate} - ${exp.endDate}`}</Text>
                <Text>{exp.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default ModernExecutiveTemplate;
