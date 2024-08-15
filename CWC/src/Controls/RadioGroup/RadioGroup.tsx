import React, { useCallback, useId } from 'react';
import { ControlTypes, IKeyValueDataSource, IObjectDatabind, IRowDatabind, useDataSource, useDatabind } from '@harpreet547/cdh';
import ControlLabel from '../ControlLabel/ControlLabel';
import { getLabelClassName } from '../HelperFunctions';
import {
    Radio as FUIRadio,
    RadioGroup as FUIRadioGroup,
    RadioProps as FUIRadioProps,
    RadioGroupProps as FUIRadioGroupProps,
    RadioGroupOnChangeData,
} from "@fluentui/react-components";

interface IRadioGroupProps extends FUIRadioGroupProps, ControlTypes.ILocalizedLabel {
    id?: string;
    labelPosition?: ControlTypes.labelPosition;
    options?: FUIRadioProps[];
    databind?: IObjectDatabind | IRowDatabind;
    dataSource?: IKeyValueDataSource;
    selectedValue?: string; // Check data type later
}
const RadioGroup: React.FC<IRadioGroupProps> = (props: IRadioGroupProps): React.ReactElement => {
    const { id, label, labelLocalizedID, labelPosition, options, databind, onChange, dataSource, selectedValue } = props;

    const autoGeneratedID = useId();

    const finalID = id ?? autoGeneratedID + '-radioGroup';

    const { boundValue, updateBoundValue } = useDatabind(databind);
    const dataSourceRows = useDataSource('KeyValueDataSource', dataSource);

    const onChangeHandler = useCallback((ev: React.FormEvent<HTMLDivElement>, data: RadioGroupOnChangeData) => {
        const finalValue = isNaN(parseInt(data.value)) ? data.value : parseInt(data.value);
        databind && updateBoundValue(finalValue);
        onChange?.(ev, data);
    }, [databind, onChange, updateBoundValue]);

    return (
        <div className={`cruds-controls-root ${getLabelClassName(labelPosition ?? 'Top')}`}>
            <ControlLabel
                htmlFor={finalID}
                label={label}
                labelLocalizedID={labelLocalizedID}
            />
            <FUIRadioGroup
                id={finalID}
                value={boundValue ? `${boundValue as string | null}` : (selectedValue ?? '')}
                onChange={onChangeHandler}
            >
                {
                    dataSourceRows && (dataSourceRows.length ?? 0) > 0 ? (
                        dataSourceRows.map(row => (
                            <FUIRadio
                                value={`${(row.key as string | number | null | undefined) ?? ''}`}
                                key={row.key as string | number}
                                label={row.value as string}
                            />
                        ))
                    ) : (
                        options?.map(option => (
                            <FUIRadio
                                {...option}
                                key={option.value as string | number}
                            />
                        ))
                    )
                }
            </FUIRadioGroup>
        </div>
    );
};
export default RadioGroup;