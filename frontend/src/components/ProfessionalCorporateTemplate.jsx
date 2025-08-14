import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define styles for the PDF document, mirroring the CSS file
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    padding: 40,
    color: '#111',
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    textAlign: 'center',
    borderBottom: 2,
    borderBottomColor: '#0D2C54', // Navy Blue
    paddingBottom: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  contactInfo: {
    fontSize: 10,
    marginTop: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#0D2C54',
    letterSpacing: 1,
    marginBottom: 10,
  },
  item: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemDate: {
    fontStyle: 'italic',
    fontSize: 11,
  },
  itemCompany: {
    fontWeight: 'bold',
    marginVertical: 2,
    fontSize: 11,
  },
  bodyText: {
    fontSize: 11,
  },
  descriptionPoint: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
    lineHeight: 1.5,
  },
  descriptionText: {
    flex: 1,
    fontSize: 11,
  },
});

const ProfessionalCorporateTemplate = ({ resumeData }) => {
  const {
    header = {},
    experience = [],
    education = [],
    skills = [],
  } = resumeData || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{header.name || 'Your Name'}</Text>
          <Text style={styles.contactInfo}>
            {`${header.address || '123 Main Street, City'} | ${header.phone || '(123) 456-7890'} | ${header.email || 'email@domain.com'}`}
          </Text>
        </View>

        {/* Objective Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objective</Text>
          <Text style={styles.bodyText}>
            {header.summary ||
              'A results-driven professional seeking a challenging role in the finance industry.'}
          </Text>
        </View>

        {/* Experience Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {(Array.isArray(experience) ? experience : [{}, {}]).map((exp, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {exp.jobTitle || 'Financial Analyst'}
                </Text>
                <Text style={styles.itemDate}>
                  {exp.startDate || 'Month, Year'} – {exp.endDate || 'Present'}
                </Text>
              </View>
              <Text style={styles.itemCompany}>
                {exp.company || 'Global Finance Corp.'},{' '}
                {exp.location || 'New York, NY'}
              </Text>
              {/* Handle bullet points in description */}
              {(
                exp.description ||
                '• Analyzed financial data.\n• Created reports.'
              )
                .split('\n')
                .map((point, j) => (
                  <View key={j} style={styles.descriptionPoint}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.descriptionText}>
                      {point.replace(/^•\s*/, '')}
                    </Text>
                  </View>
                ))}
            </View>
          ))}
        </View>

        {/* Education Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {(Array.isArray(education) ? education : [{}]).map((edu, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemTitle}>
                {edu.degree || 'Master of Business Administration (MBA)'}
              </Text>
              <Text style={styles.itemCompany}>
                {edu.institution || 'University of Business'},{' '}
                {edu.graduationDate || 'Year'}
              </Text>
            </View>
          ))}
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.bodyText}>
            {(Array.isArray(skills)
              ? skills
              : ['Financial Modeling', 'Data Analysis', 'Microsoft Excel']
            ).join(' | ')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ProfessionalCorporateTemplate;
