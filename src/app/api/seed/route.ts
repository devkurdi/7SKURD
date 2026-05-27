import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const existingCategories = await db.category.count()
    if (existingCategories > 0) {
      return NextResponse.json({ message: 'Seed data already exists' }, { status: 200 })
    }

    // Create categories
    const religious = await db.category.create({
      data: { nameBadini: 'ئایینی', nameSorani: 'ئایینی' },
    })
    const science = await db.category.create({
      data: { nameBadini: 'زانستی', nameSorani: 'زانستی' },
    })
    const history = await db.category.create({
      data: { nameBadini: 'مێژوویی', nameSorani: 'مێژوویی' },
    })
    const geography = await db.category.create({
      data: { nameBadini: 'جوگرافی', nameSorani: 'جوگرافی' },
    })
    const sports = await db.category.create({
      data: { nameBadini: 'وەرزشی', nameSorani: 'وەرزشی' },
    })
    const general = await db.category.create({
      data: { nameBadini: 'گشتی', nameSorani: 'گشتی' },
    })

    // Religious questions
    await db.question.createMany({
      data: [
        {
          textBadini: 'چەند ڕوکوعەکان ل نێژا ئێوارێدا هەن؟',
          textSorani: 'چەند ڕکوعەت ل نوێژى ئێوارادا هەیە؟',
          option1Badini: '٣', option1Sorani: '٣',
          option2Badini: '٤', option2Sorani: '٤',
          option3Badini: '٢', option3Sorani: '٢',
          option4Badini: '٥', option4Sorani: '٥',
          correctAnswer: 2,
          categoryId: religious.id,
        },
        {
          textBadini: 'کەسایەتیێ ئیسلام کێیە کو پێغەمبەرێ مە؟',
          textSorani: 'کەسایەتى ئیسلام کێیە کە پێغەمبەرى مە؟',
          option1Badini: 'حەزرەتی عیسا', option1Sorani: 'حەزرەتى عیسا',
          option2Badini: 'حەزرەتی مووسا', option2Sorani: 'حەزرەتى مووسا',
          option3Badini: 'حەزرەتی محەمەد (ص)', option3Sorani: 'حەزرەتى محەمەد (ص)',
          option4Badini: 'حەزرەتی ئیبراھیم', option4Sorani: 'حەزرەتى ئیبراھیم',
          correctAnswer: 3,
          categoryId: religious.id,
        },
        {
          textBadini: 'کام سورەتا قورئانێ سەرەکییە و د هەر نێژایەکدا دخوێنیت؟',
          textSorani: 'کام سورەتى قورئان سەرەکییە و ل هەر نوێژێکدا دەخوێنیت؟',
          option1Badini: 'سورەتی بەقەرە', option1Sorani: 'سورەتى بەقەرە',
          option2Badini: 'سورەتی فاتیحە', option2Sorani: 'سورەتى فاتیحە',
          option3Badini: 'سورەتی ئیخلاس', option3Sorani: 'سورەتى ئیخلاس',
          option4Badini: 'سورەتی ناس', option4Sorani: 'سورەتى ناس',
          correctAnswer: 2,
          categoryId: religious.id,
        },
        {
          textBadini: 'ژ چەند ئایەتان قورئان پێکدێت؟',
          textSorani: 'ل چەند ئایەتان قورئان پێکدێت؟',
          option1Badini: '٦٢٣٦', option1Sorani: '٦٢٣٦',
          option2Badini: '٦٦٦٦', option2Sorani: '٦٦٦٦',
          option3Badini: '٦٠٠٠', option3Sorani: '٦٠٠٠',
          option4Badini: '٧٠٠٠', option4Sorani: '٧٠٠٠',
          correctAnswer: 1,
          categoryId: religious.id,
        },
        {
          textBadini: 'حەج ل کام مانگێدا ئەنجام ددرێت؟',
          textSorani: 'حەج ل کام مانگێدا ئەنجام دەدرێت؟',
          option1Badini: 'ڕەمەزان', option1Sorani: 'ڕەمەزان',
          option2Badini: 'زولحەججە', option2Sorani: 'زولحەججە',
          option3Badini: 'شەووال', option3Sorani: 'شەووال',
          option4Badini: 'موعەڕەم', option4Sorani: 'موعەڕەم',
          correctAnswer: 2,
          categoryId: religious.id,
        },
      ],
    })

    // Science questions
    await db.question.createMany({
      data: [
        {
          textBadini: 'گەڕێ خۆرێ چەند گەڕان ل ساڵەکێدا دکەت ل دوری خۆرێ؟',
          textSorani: 'گەڕى خۆر چەند گەڕان ل ساڵێکدا دەکات لە دەورى خۆر؟',
          option1Badini: '١', option1Sorani: '١',
          option2Badini: '٢', option2Sorani: '٢',
          option3Badini: '٣', option3Sorani: '٣',
          option4Badini: '٤', option4Sorani: '٤',
          correctAnswer: 1,
          categoryId: science.id,
        },
        {
          textBadini: 'ئاویان H2O پێکدێت ژ چەند ئەتۆمان؟',
          textSorani: 'ئاوى H2O پێکدێت ل چەند ئەتۆم؟',
          option1Badini: '٢ هیدروجین و ١ ئۆکسجین', option1Sorani: '٢ هیدروجین و ١ ئۆکسجین',
          option2Badini: '١ هیدروجین و ٢ ئۆکسجین', option2Sorani: '١ هیدروجین و ٢ ئۆکسجین',
          option3Badini: '٣ هیدروجین و ١ ئۆکسجین', option3Sorani: '٣ هیدروجین و ١ ئۆکسجین',
          option4Badini: '٢ هیدروجین و ٢ ئۆکسجین', option4Sorani: '٢ هیدروجین و ٢ ئۆکسجین',
          correctAnswer: 1,
          categoryId: science.id,
        },
        {
          textBadini: 'کام گەڕەکا زەوییە گەورەترینە؟',
          textSorani: 'کام گەڕەکى زەوى گەورەترینە؟',
          option1Badini: 'ئاسیا', option1Sorani: 'ئاسیا',
          option2Badini: 'ئەفریقا', option2Sorani: 'ئەفریقا',
          option3Badini: 'ئەمریکا', option3Sorani: 'ئەمریکا',
          option4Badini: 'ئەورووپا', option4Sorani: 'ئەورووپا',
          correctAnswer: 1,
          categoryId: science.id,
        },
        {
          textBadini: 'خێراترین شت ل جیهانێدا چییە؟',
          textSorani: 'خێراترین شت ل جیهاندا چییە؟',
          option1Badini: 'دەنگ', option1Sorani: 'دەنگ',
          option2Badini: 'ڕووناکی', option2Sorani: 'ڕووناکی',
          option3Badini: 'ئاو', option3Sorani: 'ئاو',
          option4Badini: 'با', option4Sorani: 'با',
          correctAnswer: 2,
          categoryId: science.id,
        },
        {
          textBadini: 'زەوی چەند ساڵانە خۆی دگەڕێنێتەڤە ل دوری خۆرێ؟',
          textSorani: 'زەوى چەند ساڵانە خۆى دەگەڕێنێتەوە لە دەورى خۆر؟',
          option1Badini: '٣٦٥ ڕۆژ', option1Sorani: '٣٦٥ ڕۆژ',
          option2Badini: '٣٠٠ ڕۆژ', option2Sorani: '٣٠٠ ڕۆژ',
          option3Badini: '٤٠٠ ڕۆژ', option3Sorani: '٤٠٠ ڕۆژ',
          option4Badini: '٢٥٠ ڕۆژ', option4Sorani: '٢٥٠ ڕۆژ',
          correctAnswer: 1,
          categoryId: science.id,
        },
      ],
    })

    // History questions
    await db.question.createMany({
      data: [
        {
          textBadini: 'کام ئیمپراتۆرییەت گەورەترین بوو ل مێژوویدا؟',
          textSorani: 'کام ئیمپراتۆرییەت گەورەترین بوو ل مێژوودا؟',
          option1Badini: 'ئیمپراتۆرییەتی ڕۆمانی', option1Sorani: 'ئیمپراتۆرییەتی ڕۆمانی',
          option2Badini: 'ئیمپراتۆرییەتی بریتانی', option2Sorani: 'ئیمپراتۆرییەتی بریتانی',
          option3Badini: 'ئیمپراتۆرییەتی مەغۆل', option3Sorani: 'ئیمپراتۆرییەتی مەغۆل',
          option4Badini: 'ئیمپراتۆرییەتی عوسمانی', option4Sorani: 'ئیمپراتۆرییەتی عوسمانی',
          correctAnswer: 2,
          categoryId: history.id,
        },
        {
          textBadini: 'صلاحەدینی ئەیوبی ل کام شارێدا لەدایک بوو؟',
          textSorani: 'صلاحەدینی ئەیوبی ل کام شارێدا لەدایک بوو؟',
          option1Badini: 'تکریت', option1Sorani: 'تکریت',
          option2Badini: 'دیمەشق', option2Sorani: 'دیمەشق',
          option3Badini: 'قاهیرە', option3Sorani: 'قاهیرە',
          option4Badini: 'بەغدا', option4Sorani: 'بەغدا',
          correctAnswer: 1,
          categoryId: history.id,
        },
        {
          textBadini: 'جەنگی جیهانی یەکەم ل کام ساڵێدا دەستی پێکرد؟',
          textSorani: 'جەنگى جیهانى یەکەم ل کام ساڵێدا دەستى پێکرد؟',
          option1Badini: '١٩١٤', option1Sorani: '١٩١٤',
          option2Badini: '١٩١٨', option2Sorani: '١٩١٨',
          option3Badini: '١٩٣٩', option3Sorani: '١٩٣٩',
          option4Badini: '١٩٠٥', option4Sorani: '١٩٠٥',
          correctAnswer: 1,
          categoryId: history.id,
        },
        {
          textBadini: 'کام شارێ پایتەختی ئیمپراتۆرییەتی عوسمانی بوو؟',
          textSorani: 'کام شار پایتەختی ئیمپراتۆرییەتی عوسمانی بوو؟',
          option1Badini: 'ئەنقەرە', option1Sorani: 'ئەنقەرە',
          option2Badini: 'ئەستەمبوڵ', option2Sorani: 'ئەستەمبوڵ',
          option3Badini: 'ئیزمیر', option3Sorani: 'ئیزمیر',
          option4Badini: 'بورسا', option4Sorani: 'بورسا',
          correctAnswer: 2,
          categoryId: history.id,
        },
      ],
    })

    // Geography questions
    await db.question.createMany({
      data: [
        {
          textBadini: 'کام وڵات گەورەترینە ل جیهانێدا ب ڕووبەرێ؟',
          textSorani: 'کام وڵات گەورەترینە ل جیهاندا ب ڕووبەر؟',
          option1Badini: 'چین', option1Sorani: 'چین',
          option2Badini: 'کەنەدا', option2Sorani: 'کەنەدا',
          option3Badini: 'ڕووسیا', option3Sorani: 'ڕووسیا',
          option4Badini: 'ئەمریکا', option4Sorani: 'ئەمریکا',
          correctAnswer: 3,
          categoryId: geography.id,
        },
        {
          textBadini: 'کام چیا بەرزترینە ل جیهانێدا؟',
          textSorani: 'کام چیا بەرزترینە ل جیهاندا؟',
          option1Badini: 'ک٢', option1Sorani: 'ک٢',
          option2Badini: 'ئێڤرست', option2Sorani: 'ئێڤرست',
          option3Badini: 'کانچنجونگا', option3Sorani: 'کانچنجونگا',
          option4Badini: 'ماکالو', option4Sorani: 'ماکالو',
          correctAnswer: 2,
          categoryId: geography.id,
        },
        {
          textBadini: 'ڕووباری نیل ل کام وڵاتێدا دەست پێ دکەت؟',
          textSorani: 'ڕووبارى نیل ل کام وڵاتێدا دەست پێ دەکات؟',
          option1Badini: 'میسر', option1Sorani: 'میصر',
          option2Badini: 'سوودان', option2Sorani: 'سوودان',
          option3Badini: 'ئەسیوپیا', option3Sorani: 'ئەسیوپیا',
          option4Badini: 'یوگەندا', option4Sorani: 'یوگەندا',
          correctAnswer: 3,
          categoryId: geography.id,
        },
      ],
    })

    // Sports questions
    await db.question.createMany({
      data: [
        {
          textBadini: 'کام وەرزشێ ل جیهانێدا هەرە بەناوبانگە؟',
          textSorani: 'کام وەرزش ل جیهاندا هەرە بەناوبانگە؟',
          option1Badini: 'باسکە', option1Sorani: 'باسکە',
          option2Badini: 'تۆپی پێ', option2Sorani: 'تۆپى پێ',
          option3Badini: 'تێنس', option3Sorani: 'تێنس',
          option4Badini: 'کرکێت', option4Sorani: 'کرکێت',
          correctAnswer: 2,
          categoryId: sports.id,
        },
        {
          textBadini: 'جامی جیهانی تۆپی پێ چەند ساڵانەکێ ئەنجام ددرێت؟',
          textSorani: 'جامى جیهانى تۆپى پێ چەند ساڵانە ئەنجام دەدرێت؟',
          option1Badini: '٢ ساڵ', option1Sorani: '٢ ساڵ',
          option2Badini: '٣ ساڵ', option2Sorani: '٣ ساڵ',
          option3Badini: '٤ ساڵ', option3Sorani: '٤ ساڵ',
          option4Badini: '٥ ساڵ', option4Sorani: '٥ ساڵ',
          correctAnswer: 3,
          categoryId: sports.id,
        },
      ],
    })

    // General questions
    await db.question.createMany({
      data: [
        {
          textBadini: 'چەند ڕۆژ ل ساڵەکێدا هەن؟',
          textSorani: 'چەند ڕۆژ ل ساڵێکدا هەن؟',
          option1Badini: '٣٦٥', option1Sorani: '٣٦٥',
          option2Badini: '٣٦٠', option2Sorani: '٣٦٠',
          option3Badini: '٣٧٠', option3Sorani: '٣٧٠',
          option4Badini: '٣٥٠', option4Sorani: '٣٥٠',
          correctAnswer: 1,
          categoryId: general.id,
        },
        {
          textBadini: 'کام زمان هەرە زۆر دئاخڤرێت ل جیهانێدا؟',
          textSorani: 'کام زمان هەرە زۆر دەئاخڤرێت ل جیهاندا؟',
          option1Badini: 'ئینگلیزی', option1Sorani: 'ئینگلیزی',
          option2Badini: 'چینی', option2Sorani: 'چینی',
          option3Badini: 'ئیسپانی', option3Sorani: 'ئیسپانی',
          option4Badini: 'عەرەبی', option4Sorani: 'عەرەبی',
          correctAnswer: 2,
          categoryId: general.id,
        },
        {
          textBadini: 'خۆر چەند هەسارەیەکی هەیە؟',
          textSorani: 'خۆر چەند هەسارەیەکى هەیە؟',
          option1Badini: '٧', option1Sorani: '٧',
          option2Badini: '٨', option2Sorani: '٨',
          option3Badini: '٩', option3Sorani: '٩',
          option4Badini: '١٠', option4Sorani: '١٠',
          correctAnswer: 2,
          categoryId: general.id,
        },
      ],
    })

    return NextResponse.json({ message: 'Seed data created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}
