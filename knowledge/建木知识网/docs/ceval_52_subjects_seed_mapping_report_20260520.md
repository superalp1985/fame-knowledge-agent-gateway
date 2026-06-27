# C-Eval 52科 → 建木 H6 覆盖种子映射 C1（2026-05-20）

## 来源

- C-Eval official `subject_mapping.json`（官方 benchmark metadata）
- README 确认：C-Eval 含 13948 道选择题、52 个学科；2025-07-27 已 released complete test set。

## 产物

- 官方科目映射缓存：`[REDACTED_LOCAL_PATH]`
- 52科种子映射表：`[REDACTED_LOCAL_PATH]`

## 覆盖状态统计

- missing_or_weak: 4
- covered: 20
- partial: 28

## 按大类统计

- STEM: missing_or_weak=3, covered=11, partial=6
- Social Science: covered=4, partial=6
- Humanities: partial=8, covered=3
- Other: partial=8, missing_or_weak=1, covered=2

## covered/partial/missing 明细

- computer_network / 计算机网络 / STEM: missing_or_weak (mapped=30, direct=4)
- operating_system / 操作系统 / STEM: missing_or_weak (mapped=30, direct=3)
- computer_architecture / 计算机组成 / STEM: missing_or_weak (mapped=30, direct=3)
- college_programming / 大学编程 / STEM: covered (mapped=30, direct=28)
- college_physics / 大学物理 / STEM: partial (mapped=196, direct=5)
- college_chemistry / 大学化学 / STEM: covered (mapped=196, direct=34)
- advanced_mathematics / 高等数学 / STEM: partial (mapped=95, direct=10)
- probability_and_statistics / 概率统计 / STEM: covered (mapped=164, direct=69)
- discrete_mathematics / 离散数学 / STEM: partial (mapped=125, direct=4)
- electrical_engineer / 注册电气工程师 / STEM: partial (mapped=291, direct=6)
- metrology_engineer / 注册计量师 / STEM: partial (mapped=291, direct=1)
- high_school_mathematics / 高中数学 / STEM: covered (mapped=95, direct=95)
- high_school_physics / 高中物理 / STEM: covered (mapped=196, direct=73)
- high_school_chemistry / 高中化学 / STEM: covered (mapped=196, direct=36)
- high_school_biology / 高中生物 / STEM: covered (mapped=196, direct=24)
- middle_school_mathematics / 初中数学 / STEM: covered (mapped=95, direct=95)
- middle_school_biology / 初中生物 / STEM: covered (mapped=196, direct=24)
- middle_school_physics / 初中物理 / STEM: covered (mapped=196, direct=73)
- middle_school_chemistry / 初中化学 / STEM: covered (mapped=196, direct=36)
- veterinary_medicine / 兽医学 / STEM: partial (mapped=196, direct=3)
- college_economics / 大学经济学 / Social Science: covered (mapped=757, direct=168)
- business_administration / 工商管理 / Social Science: covered (mapped=1051, direct=283)
- marxism / 马克思主义基本原理 / Social Science: partial (mapped=216, direct=2)
- mao_zedong_thought / 毛泽东思想和中国特色社会主义理论体系概论 / Social Science: partial (mapped=103, direct=0)
- education_science / 教育学 / Social Science: partial (mapped=103, direct=0)
- teacher_qualification / 教师资格 / Social Science: partial (mapped=103, direct=0)
- high_school_politics / 高中政治 / Social Science: covered (mapped=309, direct=73)
- high_school_geography / 高中地理 / Social Science: partial (mapped=299, direct=15)
- middle_school_politics / 初中政治 / Social Science: covered (mapped=196, direct=72)
- middle_school_geography / 初中地理 / Social Science: partial (mapped=299, direct=15)
- modern_chinese_history / 近代史纲要 / Humanities: partial (mapped=103, direct=3)
- ideological_and_moral_cultivation / 思想道德修养与法律基础 / Humanities: partial (mapped=196, direct=1)
- logic / 逻辑学 / Humanities: partial (mapped=198, direct=2)
- law / 法学 / Humanities: covered (mapped=196, direct=94)
- chinese_language_and_literature / 中国语言文学 / Humanities: partial (mapped=103, direct=6)
- art_studies / 艺术学 / Humanities: partial (mapped=103, direct=0)
- professional_tour_guide / 导游资格 / Humanities: partial (mapped=103, direct=0)
- legal_professional / 法律职业资格 / Humanities: partial (mapped=93, direct=9)
- high_school_chinese / 高中语文 / Humanities: partial (mapped=103, direct=4)
- high_school_history / 高中历史 / Humanities: covered (mapped=103, direct=97)
- middle_school_history / 初中历史 / Humanities: covered (mapped=103, direct=97)
- civil_servant / 公务员 / Other: partial (mapped=242, direct=0)
- sports_science / 体育学 / Other: missing_or_weak (mapped=77, direct=1)
- plant_protection / 植物保护 / Other: partial (mapped=196, direct=0)
- basic_medicine / 基础医学 / Other: partial (mapped=273, direct=0)
- clinical_medicine / 临床医学 / Other: partial (mapped=273, direct=0)
- urban_and_rural_planner / 注册城乡规划师 / Other: partial (mapped=170, direct=2)
- accountant / 注册会计师 / Other: covered (mapped=1213, direct=1017)
- fire_engineer / 注册消防工程师 / Other: partial (mapped=273, direct=1)
- environmental_impact_assessment_engineer / 环境影响评价工程师 / Other: partial (mapped=273, direct=1)
- tax_accountant / 税务师 / Other: covered (mapped=1213, direct=121)
- physician / 医师资格 / Other: partial (mapped=273, direct=0)

## 判断
- 财经/会计/经济/法律相关科目可直接继承 H6 主干。
- STEM 与医学/工程/体育/导游等存在弱覆盖或缺失，需要 C2 开始按官方/权威教材大面积补点。
- 下一步：下载/整理 C-Eval complete data，建立本地 eval runner 与 per-subject baseline。