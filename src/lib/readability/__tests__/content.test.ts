/**
 * Readability tests for program content
 * Validates all program descriptions meet 6th-grade reading level (PLAT-02)
 */

import textReadability from 'text-readability';
import {
  medicaidContent,
  snapContent,
  ssiContent,
  ssdiContent,
  michellePWaiverContent,
  hcbWaiverContent,
  sclWaiverContent,
} from '@/content/programs';

// Access methods from default export
const fleschKincaidGrade = textReadability.fleschKincaidGrade.bind(textReadability);
const colemanLiauIndex = textReadability.colemanLiauIndex.bind(textReadability);

const MAX_DESCRIPTION_GRADE = 6;
const MAX_NEXT_STEPS_GRADE = 8;

const programs = [
  { name: 'Medicaid', content: medicaidContent },
  { name: 'SNAP', content: snapContent },
  { name: 'SSI', content: ssiContent },
  { name: 'SSDI', content: ssdiContent },
  { name: 'Michelle P Waiver', content: michellePWaiverContent },
  { name: 'HCB Waiver', content: hcbWaiverContent },
  { name: 'SCL Waiver', content: sclWaiverContent },
];

describe('Program Content Readability', () => {
  describe('Descriptions (6th grade level)', () => {
    programs.forEach(({ name, content }) => {
      test(`${name} description meets 6th grade reading level`, () => {
        const grade = fleschKincaidGrade(content.description);
        
        expect(grade).toBeLessThanOrEqual(MAX_DESCRIPTION_GRADE);
        
        // Helpful output if test fails
        if (grade > MAX_DESCRIPTION_GRADE) {
          console.log(`${name} description grade: ${grade.toFixed(1)} (max: ${MAX_DESCRIPTION_GRADE})`);
          console.log('Description:', content.description);
        }
      });
    });
  });

  describe('Next Steps (8th grade level)', () => {
    programs.forEach(({ name, content }) => {
      test(`${name} next steps meet 8th grade reading level`, () => {
        const combinedText = content.nextSteps.join(' ');
        const grade = colemanLiauIndex(combinedText);
        
        expect(grade).toBeLessThanOrEqual(MAX_NEXT_STEPS_GRADE);
        
        // Helpful output if test fails
        if (grade > MAX_NEXT_STEPS_GRADE) {
          console.log(`${name} next steps grade: ${grade.toFixed(1)} (max: ${MAX_NEXT_STEPS_GRADE})`);
          console.log('Next steps:', content.nextSteps);
        }
      });
    });
  });

  describe('Person-first language', () => {
    programs.forEach(({ name, content }) => {
      test(`${name} uses person-first language`, () => {
        const fullText = [
          content.description,
          ...content.whatItCovers,
          ...content.nextSteps,
          content.interactionNotes,
          ...(content.commonMisconceptions || []),
          ...(content.whileYouWait || []),
          content.encouragement || '',
        ].join(' ').toLowerCase();

        // Check for person-first patterns
        expect(fullText).toMatch(/people with|children with|adults with|person with/);
        
        // Avoid disability-first language
        expect(fullText).not.toMatch(/disabled people|disabled children|disabled adults/);
      });
    });
  });

  describe('Encouragement and misconceptions readability (6th grade level)', () => {
    programs.forEach(({ name, content }) => {
      if (content.encouragement) {
        test(`${name} encouragement meets 6th grade reading level`, () => {
          const grade = fleschKincaidGrade(content.encouragement!);
          expect(grade).toBeLessThanOrEqual(MAX_DESCRIPTION_GRADE);
        });
      }

      if (content.commonMisconceptions && content.commonMisconceptions.length > 0) {
        test(`${name} misconceptions meet 6th grade reading level`, () => {
          const combinedText = content.commonMisconceptions!.join(' ');
          const grade = fleschKincaidGrade(combinedText);
          expect(grade).toBeLessThanOrEqual(MAX_DESCRIPTION_GRADE);
        });
      }

      if (content.whileYouWait && content.whileYouWait.length > 0) {
        test(`${name} while-you-wait content meets 8th grade reading level`, () => {
          const combinedText = content.whileYouWait!.join(' ');
          const grade = colemanLiauIndex(combinedText);
          expect(grade).toBeLessThanOrEqual(MAX_NEXT_STEPS_GRADE);
        });
      }
    });
  });

  describe('Plain language guidelines', () => {
    programs.forEach(({ name, content }) => {
      test(`${name} addresses reader as "you"`, () => {
        const combinedText = [content.description, ...content.nextSteps].join(' ');
        expect(combinedText.toLowerCase()).toMatch(/\byou\b/);
      });

      test(`${name} has required content fields`, () => {
        expect(content.programId).toBeTruthy();
        expect(content.name).toBeTruthy();
        expect(content.description).toBeTruthy();
        expect(content.whatItCovers.length).toBeGreaterThan(0);
        expect(content.nextSteps.length).toBeGreaterThan(0);
        expect(content.requiredDocuments.length).toBeGreaterThan(0);
        expect(content.applicationUrl).toBeTruthy();
        expect(content.applicationPhone).toBeTruthy();
      });
    });
  });
});
