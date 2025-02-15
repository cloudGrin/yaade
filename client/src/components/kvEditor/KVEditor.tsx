import { useCallback, useEffect, useMemo, useRef } from 'react';

import KVRow from '../../model/KVRow';
import styles from './KVEditor.module.css';
import KVEditorRow from './KVEditorRow';

type KVEditorProps = {
  kvs: Array<KVRow>;
  setKvs?: any;
  name: string;
  readOnly?: boolean;
  hasEnvSupport: 'BOTH' | 'NONE' | 'VALUE_ONLY';
  env?: any;
};

const EMPTY_ROW = { key: '', value: '' };
const isRowEmpty = (row: KVRow) => row.key === '' && row.value === '';

function KVEditor({ name, kvs, setKvs, readOnly, hasEnvSupport, env }: KVEditorProps) {
  // we copy the data so we can append an empty last row without
  // mutating the original data
  const displayKvs = useMemo(() => {
    const result = kvs ? [...kvs] : [];
    if (!readOnly && (result.length === 0 || !isRowEmpty(result[result.length - 1]))) {
      result.push({ ...EMPTY_ROW });
    }
    return result;
  }, [kvs, readOnly]);

  const onChangeRowRef = useRef<(i: number, param: string, value: string) => void>(
    (i: number, param: string, value: string) => {},
  );
  const onDeleteRowRef = useRef<(i: number) => void>((i: number) => {});

  useEffect(() => {
    onChangeRowRef.current = (i: number, param: string, value: string) => {
      let newKvs = [...displayKvs];
      const newRow = { ...newKvs[i] } as any;
      newRow[param] = value;
      newKvs[i] = newRow;
      newKvs = newKvs.filter((el) => !isRowEmpty(el));

      setKvs(newKvs);
    };
  }, [displayKvs, setKvs]);

  useEffect(() => {
    onDeleteRowRef.current = (i: number) => {
      let newKvs = [...displayKvs];
      newKvs.splice(i, 1);
      newKvs = newKvs.filter((el) => !isRowEmpty(el));
      setKvs(newKvs);
    };
  }, [displayKvs, setKvs]);

  return (
    <div className={styles.container}>
      {displayKvs.map(({ key, value }, i) => (
        <KVEditorRow
          key={`${name}-${i}`}
          name={`${name}-${i}`}
          i={i}
          kKey={key}
          value={value}
          onChangeRow={onChangeRowRef}
          onDeleteRow={onDeleteRowRef}
          isDeleteDisabled={readOnly}
          readOnly={readOnly}
          hasEnvSupport={hasEnvSupport}
          env={env}
        />
      ))}
    </div>
  );
}

export default KVEditor;
