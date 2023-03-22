import '../assets/css/index.css'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Layout, Segmented, Select, Space } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import {
  ScoreRankingRequest,
  ScoreRankingResponse,
} from '../data/database/Report'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import { fetchScoreRanking } from '../redux/features/report/scoreRankingSlice'
import Icon from '@ant-design/icons'
import { ReactComponent as Gold } from '../assets/img/bling-gold.svg'
import { ReactComponent as Silver } from '../assets/img/bling-silver.svg'
import { ReactComponent as Bronze } from '../assets/img/bling-bronze.svg'

const { Content } = Layout

interface DataType {
  key: string
  stt: React.ReactNode
  name: React.ReactNode
  department: React.ReactNode
  score: React.ReactNode
}

interface ScoreRankingInput {
  reloadCount: number
  defaultDep: string
}

interface ScoreRankingMedal {
  index: number
}

const columns: ColumnsType<DataType> = [
  {
    title: 'STT',
    dataIndex: 'stt',
    align: 'center',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Department',
    dataIndex: 'department',
    align: 'center',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    align: 'center',
  },
]
const MedalIcon: React.FC<ScoreRankingMedal> = ({ index }) => {
  if (index === 1) {
    return <Icon component={Gold} style={{ fontSize: '30px' }} />
  } else if (index === 2) {
    return <Icon component={Silver} style={{ fontSize: '30px' }} />
  } else if (index === 3) {
    return <Icon component={Bronze} style={{ fontSize: '30px' }} />
  } else {
    return <p>{index}</p>
  }
}

const ScoreRanking: React.FC<ScoreRankingInput> = ({
  reloadCount,
  defaultDep,
}) => {
  const [value, setValue] = useState<string | number>('This week')
  const [scoreRankingReq, setScoreRankingReq] = useState<ScoreRankingRequest>({
    department: defaultDep,
    baseOnWeek: 1,
  })
  const [tableData, setTableData] = useState<DataType[]>([])
  const [options, setOptions] = useState<any[]>([])
  const [reload, setReload] = useState(reloadCount)
  const score = useAppSelector((state) => state.scoreRanking)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setReload(reload + 1)
  }, [])

  useEffect(() => {
    dispatch(fetchScoreRanking(scoreRankingReq))
  }, [reload, reloadCount])

  useEffect(() => {
    if (!score.loading && score.score.length !== undefined) {
      MappingTableData(score.score)
    }
  }, [score.loading, score.score.length])

  const MappingTableData = (scoreResponse: ScoreRankingResponse[]) => {
    let data: DataType[] = []
    for (let index = 0; index < scoreResponse.length; index++) {
      const element = scoreResponse[index]
      data.push({
        stt: <MedalIcon index={index + 1} />,
        name: <p>{element.LastName + ' ' + element.FirstName}</p>,
        department: <p>{element.Department}</p>,
        score: <p>{element.TotalScore}</p>,
        key: element._id!,
      })
    }
    setTableData(data)

    if (defaultDep.toLowerCase() === 'All'.toLowerCase()) {
      setOptions([
        {
          value: 'All',
          label: 'All',
        },
        {
          value: 'BA',
          label: 'BA',
        },
        {
          value: 'R&D',
          label: 'R&D',
        },
        {
          value: 'PMO',
          label: 'PMO',
        },
        {
          value: 'SALES',
          label: 'SALES',
        },
      ])
    } else {
      setOptions([
        {
          value: defaultDep,
          label: defaultDep,
        },
      ])
    }
  }

  const OnChangeFilter = (e: string) => {
    setValue(e)
    if (e === 'This week') {
      setScoreRankingReq({
        ...scoreRankingReq,
        baseOnWeek: 1,
        baseOnMonth: 0,
        baseOnYear: 0,
      })
    } else if (e === 'This month') {
      setScoreRankingReq({
        ...scoreRankingReq,
        baseOnMonth: 1,
        baseOnWeek: 0,
        baseOnYear: 0,
      })
    } else {
      setScoreRankingReq({
        ...scoreRankingReq,
        baseOnMonth: 0,
        baseOnWeek: 0,
        baseOnYear: 1,
      })
    }
    setReload(reload + 1)
  }

  const OnSelectFilter = (e: string) => {
    setScoreRankingReq({ ...scoreRankingReq, department: e })
    setReload(reload + 2)
  }

  return (
    <Card
      title="Score ranking"
      style={{ width: '100%' }}
      headStyle={{ backgroundColor: '#eeeeee' }}
      extra={
        <>
          <FontAwesomeIcon
            icon={faRefresh}
            size="lg"
            style={{ marginRight: '10px', cursor: 'pointer' }}
            onClick={() => setReload(reload + 1)}
          />
          {/* <FontAwesomeIcon icon={faExpand} size={'lg'} /> */}
        </>
      }
      onResize={(e) => console.log(e)}
    >
      <div style={{ marginBottom: '10px' }}>
        <Select
          showSearch
          style={{ width: 200 }}
          defaultValue={defaultDep}
          onSelect={(e) => OnSelectFilter(e)}
          placeholder="Seach to select"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={options}
        />
        <Space direction="horizontal" align="center" style={{ float: 'right' }}>
          <Segmented
            options={['This week', 'This month', 'This year']}
            value={value}
            onChange={(e) => {
              OnChangeFilter(e.toString())
            }}
          />
          {/*  <ExportMenu /> */}
        </Space>
      </div>
      <Table
        rowClassName={(record, index) => {
          return 'custom-table-row'
        }}
        showHeader={false}
        pagination={{ pageSize: 5 }}
        columns={columns}
        dataSource={tableData}
        size="middle"
      />
    </Card>
  )
}

export default ScoreRanking
