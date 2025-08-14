import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10 },
  header: {
    backgroundColor: '#FF6B6B',
    color: 'white',
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { flex: 1 },
  name: { fontSize: 30, fontWeight: 'bold' },
  title: { fontSize: 15, fontWeight: 'light', marginTop: 5 },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  body: { flexDirection: 'row' },
  sidebar: {
    width: '35%',
    backgroundColor: '#f7f7f7',
    padding: 20,
    lineHeight: 1.5,
  },
  sidebarSection: { marginBottom: 15 },
  sidebarTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  main: { width: '65%', padding: 20 },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  tag: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 9,
  },
  item: {
    borderLeft: 3,
    borderLeftColor: '#FF6B6B',
    paddingLeft: 10,
    marginBottom: 15,
  },
  itemDate: { fontSize: 9, color: '#888', marginBottom: 2 },
  itemTitle: { fontSize: 13, fontWeight: 'bold' },
  itemCompany: { fontSize: 11, fontStyle: 'italic', marginBottom: 5 },
});

const CreativeColorSplashTemplate = ({ resumeData }) => {
  const { header = {}, experience = [], skills = [] } = resumeData || {};
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{header.name || ''}</Text>
            <Text style={styles.title}>{header.title || ''}</Text>
          </View>
          <View style={styles.photoPlaceholder}></View>
        </View>
        <View style={styles.body}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>About Me</Text>
              <Text>{header.summary || ''}</Text>
            </View>
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Contact</Text>
              <Text>{header.email || ''}</Text>
              <Text>{header.phone || ''}</Text>
              <Text>{header.website || ''}</Text>
            </View>
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Expertise</Text>
              <View style={styles.tags}>
                {(Array.isArray(skills) ? skills : []).map((skill, i) => (
                  <Text key={i} style={styles.tag}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.main}>
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>Experience</Text>
              {(Array.isArray(experience) ? experience : []).map((exp, i) => (
                <View key={i} style={styles.item}>
                  <Text
                    style={styles.itemDate}
                  >{`${exp.startDate || ''} - ${exp.endDate || ''}`}</Text>
                  <Text style={styles.itemTitle}>{exp.jobTitle || ''}</Text>
                  <Text style={styles.itemCompany}>{exp.company || ''}</Text>
                  <Text>{exp.description || ''}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default CreativeColorSplashTemplate;
